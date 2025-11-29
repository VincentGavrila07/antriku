"use client";

import React from "react";
import Link from "next/link";
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export interface BreadcrumbItem {
  label: string;
  href?: string; 
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
      <Link href="/dashboard" className="flex items-center hover:text-gray-700">
        <HomeIcon className="w-4 h-4 mr-1" />
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400" />
            {isLast || !item.href ? (
              <span className="text-gray-700 font-medium">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-gray-700">
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
