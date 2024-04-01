type Product = {
  id: string;
  name: string;
  date: Date;
};

const products: Product[] = [];

export const getProducts = () => products;

export const addProduct = (product: Product) => products.push(product);

export const deleteProduct = (id: string) => {
  return products.filter((product) => product.id !== id);
};

export const updateProduct = (name: string, id: string) => {
  const data = products.find((product) => product.id === id);
  if (data) {
    data.name = name;
  } else {
    throw new Error("THERE IS NO PRODUCT AVAILABLE");
  }
};

export const getProductById = (id: string) => {
  return products.filter((product) => product.id == id);
};
