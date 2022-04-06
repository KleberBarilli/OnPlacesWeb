import React, { useState, useMemo, useEffect, useContext } from "react";
import "./newcity.css";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FaPlusCircle } from "react-icons/fa";
import Select from "react-select";
import countryList from "react-select-country-list";
import TagsInput from "react-tagsinput";
import { FiUpload } from "react-icons/fi";
import api from "../../services/api";
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";
import { fetchPlace } from "../../services/fetchPlace";

function NewCity() {
  const history = useHistory();
  const { id } = useParams();

  const [valueCountry, setValueCountry] = useState("");
  const options = useMemo(() => countryList().getData(), []);
  const { user } = useContext(AuthContext);
  const [isEdit, setIsEdit] = useState(false);

  const [name, setName] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [population, setPopulation] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [description, setDescription] = useState();
  const [tags, setTags] = useState([]);
  const [imageCityUrl, setImageCityUrl] = useState();
  const [imageCity, setImageCity] = useState();
  const [imageCityName, setImageCityName] = useState();

  const [city, setCity] = useState("");
  const [autocompleteCities, setAutocompleteCities] = useState([]);
  const [autocompleteErr, setAutocompleteErr] = useState("");

  const handleCityChange = async (e) => {
    setCity(e.target.value);
    if (!city) return;

    const res = await fetchPlace(city);
    !autocompleteCities.includes(e.target.value) &&
      res.features &&
      setAutocompleteCities(res.features.map((place) => place.place_name));
    res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
  };

  useEffect(() => {
    //console.log(localStorage.getItem('SistemaUser'))

    if (id) {
      setIsEdit(true);
      console.log(id);
      loadId();
    }
    //console.log(user.id)
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (
      name &&
      valueCountry &&
      population &&
      latitude &&
      longitude &&
      imageCity
    ) {
      if (isEdit) {
        handleUpdate();
      } else {
        handleAddCity();
      }
    } else {
      toast.error("Preencha todos os campos obrigatórios");
    }
  }
  async function loadId() {
    await api
      .get(`/city/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setName(res.data.name);
        setState(res.data.state);
        setValueCountry(res.data.valueCountry);
        setPopulation(res.data.population);
        setLatitude(res.data.latitude);
        setLongitude(res.data.longitude);
        setDescription(res.data.description);
        toast.success(res);
      })
      .catch((err) => {
        toast.error(err);
      });
  }

  async function uploadHandler(cityId) {
    const formData = new FormData();
    formData.append("image", imageCity, imageCity.name);
    api
      .patch(`/city/${cityId}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log(res);
        //history.push('/cities')
      })
      .catch((err) => {
        console.log(err);
        toast.error("Houve um erro ao enviar, confira os campos");
      });
  }

  async function handleAddCity() {
    if (!state) {
      setState(" ");
    }
    await api
      .post(
        `/city`,
        {
          name: name,
          state: state,
          country: valueCountry.label,
          population: population,
          latitude: latitude,
          longitude: longitude,
          description: description,
          tourist_places: tags.toString(),
          author: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success("Cadastrado com sucesso");
        uploadHandler(res.data.id);

        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Houve um erro ao enviar, confira os campos");
      });
  }
  async function handleUpdate() {
    if (!state) {
      setState(" ");
    }
    await api
      .put(
        `/city/${id}`,
        {
          name: name,
          state: state,
          country: valueCountry.label,
          population: population,
          latitude: latitude,
          longitude: longitude,
          description: description,
          tourist_places: tags,
          author: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success("Editado com sucesso");
        uploadHandler(id);

        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Houve um erro ao enviar, confira os campos");
      });
  }

  function handleFile(e) {
    setImageCityName(e.target.files[0].name);
    console.log(e.target.files[0]);
    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        setImageCity(image);
        setImageCityUrl(URL.createObjectURL(e.target.files[0]));
      } else {
        alert("Envie uma imagem do tipo PNG OU JPEG");
        setImageCity(null);
        return null;
      }
    }
  }

  const handleChange = (tags) => {
    setTags(tags);
  };

  const changeHandler = (value) => {
    setValueCountry(value);
  };

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Nova Cidade">
          <FaPlusCircle size={25} />
        </Title>
        <div className="container-city">
	
          <form className="placesAutocomplete card w-100 card-block bg-faded" onSubmit={handleSubmit}>
            <label style={{ fontSize:15, fontWeight: 'bold' }} htmlFor="city" className="label has-float-label">
              Nome da cidade
              {autocompleteErr && (
                <span className="inputError">{autocompleteErr}</span>
              )}
            </label>
			<input
            list="places"
            type="text"
            id="city"
            name="city"
            onChange={handleCityChange}
            value={city}
            required
            pattern={autocompleteCities.join("|")}
            autoComplete="off"
          />
          <datalist id="places">
            {autocompleteCities.map((city, i) => (
              <option key={i}>{city}</option>
            ))}
          </datalist>
          <span className="placesAutocomplete__hint" style={{ paddingBottom:10, fontSize:13}}>
            *Comece a digitar e escolha a cidade nas opções.
          </span>


            <label style={{ marginTop: 30,  paddingBottom:10, fontSize:15. }}>Descrição da cidade</label>
            <span className="mini-texto" style={ {paddingBottom:10}}>Fale um pouco sobre a cidade</span>
            <textarea
			className="textarea"
              type="text"
              placeholder="História, curiosidades, qualquer coisa :)"
              value={description}
              name="description"
              onChange={(event) => setDescription(event.target.value)}
            ></textarea>
            <label style={{ marginTop: 50, textAlign: 'center', paddingBottom:10, fontSize:15 }}>
              Pontos Turísticos <br/>- Adicione abaixo, os principais lugares da
              cidade. <br/>*Separado por vírgulas. Ex: Cristo Redentor, Pão de açucar, Maracanã
            </label>
            <input value={tags} onChange={(event) => setTags(event.target.value)} />

            <label style={{ marginTop:20, fontSize:20, fontWeight: 'bold' }}>
              Adicione uma foto para representar a cidade
            </label>

            <label 
              className="foto-cidade"
            >
              <span >
                <FiUpload color="#000000" size={50} />
              </span>
              <input type="file" accept="image/*" onChange={handleFile} />
              <span className="city-name">{imageCityName}</span>
	
            </label>
			

            <button className="btn-save-city" type="submit">
              Salvar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewCity;
