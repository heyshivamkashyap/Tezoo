import AdminGuard from "./_components/admin-guard";
import { AppSidebar } from "@/components/app-sidebar";
import { NavItem } from "@/components/nav-main";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconBuildingStore,
  IconUsers,
  IconPackage,
  IconShoppingCart,
  IconCategory,
  IconListDetails,
} from "@tabler/icons-react";

const navMainItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: <IconDashboard />,
    isActive: true,
    items: [
      {
        title: "Overview",
        url: "/admin",
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
      },
    ],
  },
  {
    title: "Store Management",
    url: "/admin/stores",
    icon: <IconBuildingStore />,
    items: [
      {
        title: "All Stores",
        url: "/admin/stores",
      },
      {
        title: "Pending Approvals",
        url: "/admin/stores/pending",
      },
      {
        title: "Rejected Stores",
        url: "/admin/stores/rejected",
      },
    ],
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: <IconUsers />,
    items: [
      {
        title: "Customers",
        url: "/admin/users/customers",
      },
      {
        title: "Admins",
        url: "/admin/users/admins",
      },
      {
        title: "Roles & Permissions",
        url: "/admin/users/roles",
      },
    ],
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: <IconPackage />,
    items: [
      {
        title: "All Products",
        url: "/admin/products",
      },
      {
        title: "Add Product",
        url: "/admin/products/create",
      },
    ],
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: <IconCategory />,
    items: [
      {
        title: "All Categories",
        url: "/admin/categories",
      },
      {
        title: "Add Category",
        url: "/admin/categories/create",
      },
    ],
  },
  {
    title: "Product Variants",
    url: "/admin/product-variants",
    icon: <IconListDetails />,
    items: [
      {
        title: "All Variants",
        url: "/admin/product-variants",
      },
      {
        title: "Add Variant",
        url: "/admin/product-variants/create",
      },
    ],
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: <IconShoppingCart />,
    items: [
      {
        title: "All Orders",
        url: "/admin/orders",
      },
      {
        title: "Cancelled Orders",
        url: "/admin/orders/cancelled",
      },
    ],
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <SidebarProvider>
        <AppSidebar navMainItems={navMainItems} />
        <SidebarInset>
          <header className="flex h-10 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  );
}
