import porkImg from "@/assets/product-pork-siomai.jpg";
import beefImg from "@/assets/product-beef-siomai.jpg";
import japaneseImg from "@/assets/product-japanese-siomai.jpg";
import sharksfinImg from "@/assets/product-sharksfin-siomai.jpg";
import longganisaImg from "@/assets/product-longganisa.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  flavors?: string[];
}

export const products: Product[] = [
  {
    id: "pork-siomai",
    name: "Pork Siomai",
    category: "Siomai",
    description: "Classic Filipino pork siomai made with premium ground pork and savory seasonings.",
    image: porkImg,
    flavors: ["Original", "Spicy", "Cheese"],
  },
  {
    id: "beef-siomai",
    name: "Beef Siomai",
    category: "Siomai",
    description: "Rich and flavorful beef siomai, a hearty twist on the classic dumpling.",
    image: beefImg,
    flavors: ["Original", "Pepper Steak"],
  },
  {
    id: "japanese-siomai",
    name: "Japanese Siomai",
    category: "Siomai",
    description: "Japanese-inspired siomai with a delicate blend of sesame and miso flavors.",
    image: japaneseImg,
    flavors: ["Sesame", "Teriyaki"],
  },
  {
    id: "sharksfin-siomai",
    name: "Shark's Fin Siomai",
    category: "Siomai",
    description: "Premium shark's fin style siomai — a best-seller loved by customers.",
    image: sharksfinImg,
    flavors: ["Original", "Supreme"],
  },
  {
    id: "longganisa-calumpit",
    name: "Longganisang Calumpit",
    category: "Longganisa",
    description: "Authentic Calumpit-style longganisa, sweet and garlicky Filipino sausage.",
    image: longganisaImg,
    flavors: ["Sweet", "Garlic", "Hamonado", "Spicy"],
  },
];
