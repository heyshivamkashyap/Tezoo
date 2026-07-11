import { ImageAsset } from "./image-asset";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: ImageAsset;
  parentId: string | null;
  isActive: boolean;
}
