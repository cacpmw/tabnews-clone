function status(request, response) {
  response.status(200).json({ chave: "Ok" });
}

export default status;
