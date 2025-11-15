import { createNavigation } from "next-intl/navigation";

import { routing } from "@/i18n";


export const { Link, usePathname, useRouter } = createNavigation(routing);
