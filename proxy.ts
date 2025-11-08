import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n";


const middleware = createMiddleware(routing);
export default middleware;

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
