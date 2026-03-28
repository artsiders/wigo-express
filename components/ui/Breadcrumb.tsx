import { Link } from "@/i18n/routing";
import { IoChevronForward } from "react-icons/io5";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm font-medium text-neutral-400 mb-6 w-full overflow-x-auto whitespace-nowrap hide-scrollbar">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.label} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:text-dark transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-dark font-bold" : ""}>
                {item.label}
              </span>
            )}

            {!isLast && (
              <IoChevronForward className="mx-2 text-neutral-300 shrink-0" size={14} />
            )}
          </div>
        );
      })}
    </nav>
  );
}
