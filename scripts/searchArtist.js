const d = document,
  $inputSearch = d.getElementById("search-artist"),
  $dataList = d.getElementById("data-artist"),
  options = {
    mode: "cors",
    cache: "default",
  };

let artistOld;

const getDataArtist = async (artist) => {
  try {
    const data = await fetch(
      `https://www.theaudiodb.com/api/v1/json/1/search.php?s=${artist}`,
      options
    );
    if (!data.ok) throw `Error ${data.status} : ${data.statusText}`;
    return data.json();
  } catch (error) {
    console.error(error);
  }
};

export const getArtist = () => {
  d.addEventListener("keyup", async (e) => {
    if (e.target === $inputSearch) {
      if (e.target.value !== "") {
        if (artistOld !== e.target.value) {
          let valueInput = e.target.value.toLowerCase(),
            dataArtist = await getDataArtist(valueInput);
          $dataList.classList.remove("d-none");
          artistOld = e.target.value;
          buildDatalist(dataArtist);
        }
      } else {
        $dataList.textContent = "";
        $dataList.classList.add("d-none");
      }
    }
  });
};

const buildDatalist = (dataArtist) => {
  const { artists } = dataArtist,
    $fragment = d.createDocumentFragment();
  $dataList.textContent = "";
  try {
    if (artists) {
      artists.forEach((artist) => {
        const $nameArtist = d.createElement("p"),
          $img = d.createElement("img"),
          $container = d.createElement("div");
        $nameArtist.textContent = artist.strArtist;
        $nameArtist.classList.add("name-artist");
        $img.src = artist.strArtistThumb || "./../assets/img/noimage.jpg";
        $container.classList.add("artist-option");
        $container.setAttribute("data-name", artist.strArtist);
        $container.appendChild($img);
        $container.appendChild($nameArtist);
        $fragment.appendChild($container);
      });
      $dataList.appendChild($fragment);
    } else {
      const $nameArtist = d.createElement("h3");
      $nameArtist.textContent = `Artista no encontrado`;
      $dataList.appendChild($nameArtist);
    }
  } catch (error) {
    console.error(error);
  }
};

d.addEventListener("click", async (e) => {
  if (e.target.matches(".artist-option *")) {
    const dataName = e.target.parentElement.dataset.name,
      dataArtist = await getDataArtist(dataName);
    $dataList.classList.add("d-none");

    const $nameArtist = d.createElement("h1"),
      $bioArtist = d.createElement("p");

    $nameArtist.textContent = dataArtist.artists[0].strArtist;
    $bioArtist.textContent = dataArtist.artists[0].strBiographyEN;

    const $artistBio = d.querySelector(".artist-bio");

    if ($artistBio.hasChildNodes()) {
      $artistBio.textContent = "";
    }

    $artistBio.appendChild($nameArtist);
    $artistBio.appendChild($bioArtist);
  }
});
