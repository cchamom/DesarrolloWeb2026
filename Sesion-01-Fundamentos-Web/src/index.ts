async function fetchPrueba(url: string): Promise<void> {
  try{
    const response = await fetch(url);

    if(!response.ok) {
      throw new Error(`Error en la petición: ${response.status} ${response.statusText}`)
    }
    const data =  await response.json();

    console.log(JSON.stringify(data, null, 2));
  } catch(error) {
    console.error("No se pudo consumir la API:", error);
  }
}

const apiURL = "https://jsonplaceholder.typicode.com/posts/1";
fetchPrueba(apiURL);