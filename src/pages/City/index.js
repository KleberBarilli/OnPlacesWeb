import React, { useState, useMemo, useEffect, useContext } from 'react';
import './city.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FaInfoCircle } from 'react-icons/fa';
import { BsFillGeoAltFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../contexts/auth';
import { MdOutlinePeopleAlt } from 'react-icons/md';
import ReactCountryFlag from 'react-country-flag';
import lookup from 'country-code-lookup';
import CityMap from '../../components/City/Map';

function City() {
	const { id } = useParams();
	const { user } = useContext(AuthContext);

	const [city, setCity] = useState([]);
	const [places, setPlaces] = useState('');
	const [touristPlaces, setTouristPlaces] = useState([]);
	const [countryCode, setCountryCode] = useState('');
	const [imageCity, setImageCity] = useState('');

	useEffect(() => {
		loadCity();
	}, [places]);

	async function loadCity() {
		await api
			.get(`city/${id}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
					'Content-Type': 'application/json',
				},
			})
			.then(res => {
				setCity(res.data);
				setPlaces(res.data.tourist_places);
				setImageCity(res.data.image);
				handlePlaces();
			})
			.catch(err => {
				console.log(err);
			});
	}

	function handlePlaces() {
		let placesArray = places.split(',');
		setTouristPlaces(placesArray);

		try {
			setCountryCode(lookup.byCountry(`${city.country}`).iso2);
		} catch (err) {
			return;
		}
	}

	return (
		<div>
			<Header />
			<div className="content">
				<div className="flag-title">
					<Title
						name={`${city.name} ${city.state ? city.state : ''} - ${
							city.country
						}`}
					>
						<ReactCountryFlag
							className="emojiFlag"
							countryCode={countryCode}
							style={{
								fontSize: '2em',
								lineHeight: '2em',
							}}
							aria-label={city.country}
						/>
					</Title>
				</div>
				<div className="description" >
						Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
					</div>
				{city.length === 0 ? (
					<div>Carregando Mapa....</div>
				) : (
					<div style={{display:'flex', justifyContent:'center'}}>
						<CityMap width={750} city={city} />
					</div>

				)}
				<div className="description" >
						It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
					</div>

				<div className="container">
					<img
						className="city-image"
						alt="img-city"
						src={`${process.env.REACT_APP_S3_URL}/${imageCity}`}
					></img>
				</div>

				<div className="description"> {city.description}</div>
				{touristPlaces && (
					<div className="places description">
						<h1>Confira alguns pontos turísticos</h1>
						{touristPlaces.map((item, index) => {
							return (
								<>
									<ul className="rounded-list" key={index}>
										<li>
											<span className="a">{item}</span>
										</li>
									</ul>
								</>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export default City;
