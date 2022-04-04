import { useState, useContext, useEffect } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUpload, FiUser } from 'react-icons/fi';
import avatar from '../../assets/avatar.png';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../../contexts/auth';
import api from '../../services/api';

function Profile() {
	const { user, signOut, setUser, storageUser } = useContext(AuthContext);
	const history = useHistory();

	const [name, setName] = useState(user && user.name);
	const [email, setEmail] = useState(user && user.email);

	const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
	const [imageAvatar, setImageAvatar] = useState(null);


	useEffect(() => {}, [avatarUrl])

	function handleFile(e) {
		if (e.target.files[0]) {
			const image = e.target.files[0];

			if (image.type === 'image/jpeg' || image.type === 'image/png') {
				setImageAvatar(image);
				setAvatarUrl(URL.createObjectURL(e.target.files[0]));
			} else {
				alert('Envie uma imagem do tipo PNG ou JPEG');
				setImageAvatar(null);
				return null;
			}
		}
	}
	async function handleUpload() {
		const formData = new FormData();
		formData.append('image', imageAvatar, imageAvatar.name);
		api.patch(`/useravatar/${user.id}`, formData, {
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		})
			.then(res => {
				user.avatarUrl = res.data.avatar
				console.log(user.avatarUrl);
				alert('Foto alterada com sucesso')
				history.push('/dashboard')
			})
			.catch(err => {
				console.log(err);
				alert('Houve um erro ao enviar, confira os campos');
			});
	}

	async function handleSave(e) {
		e.preventDefault();

		if (imageAvatar === null && name !== '') {
			await api
				.patch(
					'/profile',
					{
						name: name,
					},
					{
						headers: { Authorization: `Bearer ${user.token}` },
					},
				)
				.then(() => {
					let data = {
						...user,
						name: name,
					};
					setUser(data);
					storageUser(data);
					alert('Nome Editado');
				})
				.catch(err => {
					alert(err);
				});
		} else if (name !== '' && imageAvatar !== null) {
			handleUpload();
		}
	}

	return (
		<div>
			<Header />

			<div className="content">
				<Title name="Meu Perfil">
					<FiUser size={25} />
				</Title>

				<div className="container">
					<form className="form-profile" onSubmit={handleSave}>
						<label
							className="label-avatar
						"
						>
							<span>
								<FiUpload color="#FFF" size={25} />
							</span>
							<input
								type="file"
								accept="image/*"
								onChange={handleFile}
							/>
							<br />
							{avatarUrl === null ? (
								<img
									src={avatar}
									width="250"
									height="250"
									alt="Altere sua foto aqui"
								/>
							) : (
								<img
									src={avatarUrl}
									width="250"
									height="250"
									alt="Altere sua foto"
								/>
							)}
						</label>

						<label>Nome</label>
						<input
							type="text"
							value={name}
							onChange={e => setName(e.target.value)}
						/>

						<label>Email</label>
						<input type="text" value={email} disabled="true" />

						<button type="submit">Salvar</button>
					</form>
				</div>
				<div className="container">
					<button className="logout-btn" onClick={() => signOut()}>
						Sair
					</button>
				</div>
			</div>
		</div>
	);
}

export default Profile;
