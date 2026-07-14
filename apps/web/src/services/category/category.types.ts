import { ImageAsset } from "@/types/image-asset";

export interface DefaultSubCategory {
  _id: string;
  slug: string;
}

export interface HomeCategory {
  _id: string;
  name: string;
  slug: string;
  image: ImageAsset;
  defaultSubCategory?: DefaultSubCategory | null;
}
