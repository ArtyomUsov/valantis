import md5 from "md5";

export type Product = {
  brand: string;
  id: string;
  price: number;
  product: string;
};

export const fetchProducts = async (params: {
  action: string;
  params: { offset: number; limit: number };
}): Promise<Product[]> => {
  const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const authString = md5(`Valantis_${timestamp}`);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth": authString,
    },
    body: JSON.stringify(params),
  };

  try {
    const response = await fetch(
      "http://api.valantis.store:40000/",
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Ошибка при запросе к API");
    }
    const data = await response.json();
    console.log(data.result);

    const correctResult: { [key: string]: Product } = data.result.reduce(
      (acc: { [key: string]: Product }, item: Product) => {
        const id = typeof item === "string" ? item : item.id;
        if (!acc[id]) {
          acc[id] = item;
        }
        return acc;
      },
      {}
    );

    console.log(Object.values(correctResult));
    const correctArr = Object.values(correctResult);

    console.log(correctArr);

    return correctArr as Product[];
  } catch (error) {
    console.error(error);
    console.log("Повторный запрос...");
    return new Promise((resolve) => {
      setTimeout(async () => {
        const productList = await fetchProducts(params);
        resolve(productList);
      }, 5000);
    });
  }
};
