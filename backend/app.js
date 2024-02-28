const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const path = require("path");
const tokenExpiresIn = "1hr";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

let userData, adminData, superAdminData, adminAccess;

try {
  userData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data/user.json"), "utf-8")
  );
  adminData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data/admin.json"), "utf-8")
  );
  adminAccess = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data/adminAccess.json"), "utf-8")
  );
  superAdminData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data/superAdmin.json"), "utf-8")
  );
} catch (error) {
  console.error("Error reading JSON file:", error.message);
  process.exit(1);
}

const SECRET = process.env.SECRET_KEY;

const authenticateJwt = (req, res, next) => {
  const token = req.cookies.authToken;
  // console.log("token", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Token Verification Failed" });
    }

    // console.log("authenticate jwt", user);

    req.user = user;
    // console.log(user);
    return next();
  });
};

const checkUserRole = (req, res, next) => {
  const { email } = req.user;
  let userRole = null;

  if (superAdminData[0].email === email) {
    userRole = "superadmin";
  } else if (adminData.some((a) => a.email === email)) {
    userRole = "admin";
  } else if (userData.some((a) => a.email === email)) {
    userRole = "user";
  }

  if (!userRole) {
    return res.json({ message: "Invalid role" });
  }

  req.user.role = userRole;
  // console.log(req.user.role);
  return next();
};

app.get("/adminaccessreq", authenticateJwt, checkUserRole, (req, res) => {
  const { role } = req.user;
  if (role == "superadmin") return res.send(adminAccess);
  else return res.json({ msg: "Unauthorized Access" });
});

app.post("/reqadmin", authenticateJwt, (req, res) => {
  const { firstName, email } = req.user;
  // console.log(req);
  const data = { firstName, email };
  const isPresent = adminAccess.some((a) => a.email === email);
  if (!isPresent) {
    adminAccess.push(data);
    fs.writeFileSync(
      "./data/adminAccess.json",
      JSON.stringify(adminAccess),
      "utf-8"
    );
    return res.json({ message: "Admin access requested successfully" });
  } else {
    return res.ok(false);
  }
});

app.post("/superadmin", authenticateJwt, checkUserRole, (req, res) => {
  const { role } = req.user;
  const { email } = req.body;
  const { decision } = req.body;
  console.log(email);

  if (role === "superadmin") {
    switch (decision) {
      case "approve":
        const data = userData.find((a) => a.email === email);
        adminData.push(data);
        fs.writeFileSync(
          "./data/admin.json",
          JSON.stringify(adminData),
          "utf-8"
        );
        adminAccess = adminAccess.filter((a) => a.email !== email);
        fs.writeFileSync(
          "./data/adminAccess.json",
          JSON.stringify(adminAccess),
          "utf-8"
        );
        return res.json(`Admin access approved for ${email}`);

      case "deny":
        adminAccess = adminAccess.filter((a) => a.email !== email);
        fs.writeFileSync(
          "./data/adminAccess.json",
          JSON.stringify(adminAccess),
          "utf-8"
        );
        return res.json(`Admin access denied for ${email}`);
    }
  } else {
    return res.json("Invalid user - Not Superadmin");
  }
});

app.post("/validate", authenticateJwt, (req, res) => {
  return res.json({ message: "Token is valid" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let role;
  if (
    superAdminData[0].email === email &&
    superAdminData[0].password === password
  )
    role = "superadmin";
  else if (adminData.some((a) => a.email === email && a.password === password))
    role = "admin";
  else if (userData.some((a) => a.email === email && a.password === password))
    role = "user";
  else role = null;

  if (!role) {
    return res.json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email, role }, SECRET, {
    expiresIn: tokenExpiresIn,
  });
  res.cookie("authToken", token, {
    httpOnly: true,
    expiresIn: tokenExpiresIn,
  });

  res.cookie("role", role, { httpOnly: true });

  return res.json({
    role: role,
    message: `${role} logged in successfully`,
    token,
  });
});

app.post("/signup", (req, res) => {
  const { firstName, lastName, email, mobileNo, password } = req.body;
  if (!firstName || !lastName || !email || !mobileNo || !password) {
    return res.json({ message: "All fields are required" });
  }
  const user = userData.find((u) => u.email === email);

  if (user) {
    return res.json({ message: "Email id already exists" });
  } else {
    const newUser = {
      firstName,
      lastName,
      email,
      mobileNo,
      password,
    };

    userData.push(newUser);

    fs.writeFileSync("./data/user.json", JSON.stringify(userData), "utf-8");
    const token = jwt.sign({ email, role: "user" }, SECRET, {
      expiresIn: tokenExpiresIn,
    });
    return res.json({ message: "User created successfully", token });
  }
});

app.get("/dashboard", authenticateJwt, checkUserRole, (req, res) => {
  const { role, email } = req.user;
  switch (role) {
    case "superadmin":
      var response = superAdminData.concat(
        adminData.concat(userData).map((data) => {
          const { password, ...resp } = data;
          return resp;
        })
      );
      return res.send(response);

    case "admin":
      var response = adminData.concat(userData).map((data) => {
        const { password, ...resp } = data;
        return resp;
      });

      return res.send(response);

    case "user":
      const { password, ...resp } = userData.find((a) => a.email === email);
      const data = [];
      data.push(resp);
      data[0].role = "user";
      // console.log(data);
      return res.send(data);
  }

  return res.json({ message: "Invalid user" });
});

app.post("/logout", (req, res) => {
  res.clearCookie("authToken", { httpOnly: true });
  res.clearCookie("role", { httpOnly: true });
  return res.json({ message: "Logout successful" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});