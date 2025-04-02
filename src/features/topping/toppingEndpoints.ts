const ToppingBase: string = "/toppings"

const ToppingEndpoint = {
  getAllToppings: () => `${ToppingBase}/`,
  updateTopping: (id: string) => `${ToppingBase}/${id}`,
  createTopping: () => "/toppings",
  deleteTopping: (id: string) => `${ToppingBase}/delete/${id}`,
}

export default ToppingEndpoint
