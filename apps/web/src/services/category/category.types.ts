import { ImageAsset } from "@/types/image-asset";

export interface MainCategory {
  _id: string;
  name: string;
  slug: string;
  image: ImageAsset;
  isActive: boolean;
}
