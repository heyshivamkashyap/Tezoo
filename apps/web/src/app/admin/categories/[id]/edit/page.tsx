import { getServerApi } from "@/lib/server-axios";
import { EditCategoryForm } from "../../_components/edit-category-form";
import { ApiResponse } from "@/types/api-response";
import { Category } from "@/types/category";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const api = await getServerApi();
  const { data } = await api.get<ApiResponse<Category>>(
    `/category/get-category/${id}`,
  );

  return <EditCategoryForm category={data.data} />;
}
