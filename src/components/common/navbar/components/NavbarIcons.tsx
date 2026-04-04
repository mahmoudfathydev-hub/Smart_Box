"use client";

import CartIcon from "@/components/common/navbar/components/CartIcon";
import FavoriteIcon from "@/components/common/navbar/components/FavoriteIcon";

export default function NavbarIcons() {
  return (
    <div className="flex items-center gap-1">
      <CartIcon />
      <FavoriteIcon />
    </div>
  );
}
