import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  function isArabicText(text: string): boolean {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          href={item?.link}
          key={item?.link}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          dir={isArabicText(item.title) ? "rtl" : "ltr"}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#3D9BD6]/10 to-[#1B3664]/10 block  rounded-2xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card isRTL={isArabicText(item.title)}>
            {item.icon && <CardIcon>{item.icon}</CardIcon>}
            <CardTitle isRTL={isArabicText(item.title)}>{item.title}</CardTitle>
            <CardDescription isRTL={isArabicText(item.title)}>
              {item.description}
            </CardDescription>
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
  isRTL = false,
}: {
  className?: string;
  children: React.ReactNode;
  isRTL?: boolean;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-6 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#3D9BD6] dark:hover:border-[#3D9BD6] group-hover:shadow-xl group-hover:shadow-[#3D9BD6]/10 group-hover:-translate-y-1 transition-all duration-300 relative z-20",
        className,
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="relative z-50">
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

export const CardIcon = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3D9BD6] to-[#1B3664] mb-4 group-hover:scale-110 transition-transform duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
  isRTL = false,
}: {
  className?: string;
  children: React.ReactNode;
  isRTL?: boolean;
}) => {
  return (
    <h4
      className={cn(
        "text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#3D9BD6] dark:group-hover:text-[#3D9BD6] transition-colors duration-300",
        isRTL ? "text-right" : "text-left",
        className,
      )}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
  isRTL = false,
}: {
  className?: string;
  children: React.ReactNode;
  isRTL?: boolean;
}) => {
  return (
    <p
      className={cn(
        "text-gray-600 dark:text-gray-400 leading-relaxed text-sm",
        isRTL ? "text-right" : "text-left",
        className,
      )}
    >
      {children}
    </p>
  );
};
