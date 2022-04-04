import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import './signin.css';
import logo from '../../assets/logo2.png';
import { FaGithub } from 'react-icons/fa';

function SignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { signIn, loadingAuth } = useContext(AuthContext);

	function handleSubmit(e){
		e.preventDefault();

		if(email !== '' && password !== ''){
			signIn(email, password);
		}
	}

	return (
	  <div className="container-center">
		<div className="login">
		<h3>OnPlaces App</h3>
	
			<div className="login-area">
				<img src={logo} alt="Logo" />
			</div>
			<a href="https://github.com/KleberBarilli/OnPlaces" target="_blank" rel="noreferrer" className="github">Contribua com o projeto no GitHub </a>

			<a href="https://github.com/KleberBarilli/OnPlaces" target="_blank" rel="noreferrer"><FaGithub size={25}/></a>
			<form onSubmit={handleSubmit}>
				<h1>Entrar</h1>
				<input type="text" placeholder="email@email.com" value={email} onChange={ (e) => setEmail(e.target.value) } />
				<input type="password" placeholder="*******" value={password} onChange={ (e) => setPassword(e.target.value) }/>
				<button type="submit">{loadingAuth ? 'Carregando...': 'Acessar'}</button>
			</form>
			<Link to="/register">Criar uma Conta</Link>
		</div>
	  </div>
	);
  }

  export default SignIn;
