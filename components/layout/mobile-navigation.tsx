// "use client";

// import Link from "next/link";
// import {
//   usePathname,
// } from "next/navigation";

// import {
//   Grid2X2,
//   House,
//   ShoppingBag,
//   UserRound,
// } from "lucide-react";

// const items = [
 
//   {
//     label: "Categories",
//     href: "/?browse=categories",
//     icon: Grid2X2,
//   },
//   {
//     label: "Cart",
//     href: "/cart",
//     icon: ShoppingBag,
//   },
//   {
//     label: "Account",
//     href: "/account",
//     icon: UserRound,
//   },
// ];

// export function StoreMobileNav() {
//   const pathname =
//     usePathname();

//   const cartCount = 2;

//   const isActive = (
//     href: string
//   ) => {
//     if (href === "/") {
//       return pathname === "/";
//     }

//     if (
//       href.startsWith(
//         "/?browse="
//       )
//     ) {
//       return false;
//     }

//     return pathname.startsWith(
//       href
//     );
//   };

//   return (
//     <nav
//       aria-label="Mobile navigation"
//       className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
//     >
//       <div className="grid h-[68px] grid-cols-4">
//         {items.map((item) => {
//           const Icon =
//             item.icon;

//           const active =
//             isActive(item.href);

//           const isCart =
//             item.label ===
//             "Cart";

//           return (
//             <Link
//               key={item.label}
//               href={item.href}
//               className={`relative flex min-w-0 flex-col items-center justify-center gap-1 transition-colors ${
//                 active
//                   ? "text-primary"
//                   : "text-muted-foreground"
//               }`}
//             >
//               <div className="relative">
//                 <Icon
//                   className="h-[21px] w-[21px]"
//                   strokeWidth={
//                     active
//                       ? 2.2
//                       : 1.8
//                   }
//                 />

//                 {isCart &&
//                   cartCount >
//                     0 && (
//                     <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
//                       {cartCount >
//                       99
//                         ? "99+"
//                         : cartCount}
//                     </span>
//                   )}
//               </div>

//               <span
//                 className={`max-w-full truncate text-[11px] ${
//                   active
//                     ? "font-semibold"
//                     : "font-medium"
//                 }`}
//               >
//                 {item.label}
//               </span>

//               {active && (
//                 <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />
//               )}
//             </Link>
//           );
//         })}
//       </div>
//     </nav>
//   );
// }
export function StoreMobileNav() {
  return null;
}     