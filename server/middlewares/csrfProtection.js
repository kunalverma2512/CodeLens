import csrf from "csurf";

const isProd = process.env.NODE_ENV === "production";

export const csrfProtection = csrf({
  cookie: {
    key: "_csrf",
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/",
  },
});
