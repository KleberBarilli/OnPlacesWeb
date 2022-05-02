import { useState, useEffect } from 'react';
import './cities.css';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FaCity, FaPlus, FaSearchPlus, FaEdit } from 'react-icons/fa';
import api from '../../services/api';
import { PageActions } from '../../components/Pageaction';
import { useHistory } from 'react-router-dom';

function Cities() {
	const history = useHistory();

	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState();

	const [cities, setCities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [isEmpty, setIsEmpty] = useState(false);


	useEffect(() => {
		loadCities();
	}, [page]);

	async function loadCities() {
		await api
			.get(`/city?page=${page}`, {
				params: {
					per_page: 10,
				},
			})
			.then(res => {
				let a = Object.values(res.data.data);
				updateState(a);
			})
			.catch(err => {
				console.log(err);
				setLoadingMore(false);
			});
		setLoading(false);
	}

	function handlePage(action) {
		setPage(action === 'back' ? page - 1 : page + 1);
	}

	async function updateState(res) {
		const isDataEmpty = res.size === 0;

		if (!isDataEmpty) {
			let list = [];

			res.forEach(data => {
				list.push({
					id: data.id,
					name: data.name,
					state: data.state,
					country: data.country,
					population: data.population,
					created_at: data.created_at,
					updated_at: data.updated_at,
				});
			});

			setCities(cities => [...cities, ...list]);
		} else {
			setIsEmpty(true);
		}

		setLoadingMore(false);
	}

	function handleSearch(name){
		history.push(`city/${name}`)
	}

	return (
		<div>
			<Header />

			<div className="content">
				<Title name="Cidades">
					<FaCity size={25} />
				</Title>
				{cities.length === 0 ? (
					<div className="container dashboard">
						<span>Nenhuma cidade registrada...</span>
						<Link className="new" to="/newcity">
							<FaPlus size={25} color="#FFF" />
							Nova cidade
						</Link>
					</div>
				) : (
					<>
						<Link className="new" to="/newcity">
							<FaPlus size={25} color="#FFF" />
							Nova cidade
						</Link>

						<table>
							<thead>
								<tr>
									<th scope="col">Cidade</th>
									<th scope="col">Estado</th>
									<th scope="col">País</th>
									<th scope="col">População</th>
									<th scope="col">#</th>
								</tr>
							</thead>
							<tbody>
								{cities.map((item, index) => {
									return (
							
										<tr key={index}>
							
											<td data-label="Cidade">
												<Link style={{textDecoration:'none', color:'#000'}} to={`/city/${item.id}`}>{item.name}</Link>
											</td>
											<td data-label="Estado">
											<Link style={{textDecoration:'none', color:'#000'}} to={`/city/${item.id}`}>{item.state}</Link>
											</td>
											<td data-label="País">
												<Link style={{textDecoration:'none', color:'#000'}} to={`/city/${item.id}`}>{item.name}</Link>
											</td>
											<td data-label="População">
												{item.population}
											</td>
											<td data-label="#">
											
													<Link
													to={`/city/${item.id}`}
													className="action"
													style={{
														backgroundColor:
															'#0052cc',
													}}
												>
													<FaSearchPlus
														color="#000"
														size={17}
														onClick={()=>handleSearch(item.id)}
													/>
														</Link>
									
												<Link
													to={`/newcity/${item.id}`}
													className="action"
													style={{
														backgroundColor:
															'#f7902f',
													}}
												>
													<FaEdit
														color="#000"
														size={17}
													/>
												</Link>
											</td>
										
										</tr>
									
									);
								})}
							</tbody>
						</table>
						<PageActions>
							<button
								type="button"
								onClick={() => handlePage('next')}
								style={{display:'flex', justifyContent:'center', alignItems:'center'}}
							>
								Mostrar mais
							</button>
						</PageActions>
					</>
				)}
			</div>
		</div>
	);
}

export default Cities;
