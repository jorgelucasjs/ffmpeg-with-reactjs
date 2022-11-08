import React, {useState } from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

function App() {
	const [videoSrc, setVideoSrc] = useState("");
	const [imageFile, setImageFile] = useState<File>();
	const [soundFile, setSoundFile] = useState<File>();

	const handleChangesImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
		try {
			const filePhoto: FileList = e.target?.files as FileList;
			setImageFile(filePhoto[0]);
		} catch (error) {
			console.log(error);
		}
	};

	const songLoaded = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file: FileList = e.target?.files as FileList;
			setSoundFile(file[0]);
		} catch (error) {
			console.error(error);
		}
	};

	const ffmpeg = createFFmpeg({
		log: true,
	});

	/* const createVideo = async ()=>{
		await ffmpeg.load()
		.then(async (result)=> {

			ffmpeg.FS('writeFile', 'image.png', await fetchFile(imageFile as File));
			ffmpeg.FS('writeFile', 'sound.mp3', await fetchFile(soundFile as File));
			await ffmpeg.run("-framerate", "1/10", "-i", "image.png", "-i", "sound.mp3",
			"-c:v", "libx264", "-t", "10", "-pix_fmt", "yuv420p", "-vf", "scale=1920:1080", "test.mp4");
		
			const data = ffmpeg.FS('readFile', 'test.mp4');

			const audio = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
			setVideoSrc(audio);
		}).catch((error)=>{
			console.log('ERRO ====> ', error);
		});
	} */

	const createVideo = async ()=>{
		await ffmpeg.load()
		.then(async ()=> {

			ffmpeg.FS('writeFile', "song.mp3", await fetchFile(soundFile as File));

			await ffmpeg.run("-y", "-i", "song.mp3", "sometrack.wav", "-c:a", 
			"libmp3lame", "-b:a", "256k", "-muxdelay", "0", "-f", "segment", 
			"-sc_threshold", "0", "-segment_time", "7", "-segment_list","playlist.m3u8",
			"-segment_format","mpegts","file%d.m4a");

			const data = ffmpeg.FS('readFile', 'song.mp3');

			const music = new Blob([data.buffer], {type: 'audio/mp3'});
			console.log(music);
		
		}).catch((error)=>{
			console.log('ERRO ====> ', error);
		});
	}

	return (
		<div className="App">
			<div>
				<video height={300} width={600} src={videoSrc} controls></video>
			</div>
			<div>
				<legend>Imagem</legend>
				<input
					type="file"
					id='image'
					accept='image/*'
					onChange={(e) => handleChangesImage(e)}
				/>
			</div>
			<br />
			<br />

			<div>
				<legend>Música</legend>
				<input
					type='file'
					id='songFile'
					onChange={songLoaded}
					accept='audio/mp3,audio/wav'
				/>
			</div>

			<br />
			<br />
			<button onClick={createVideo}>
				create a video from the things above!
			</button>
		</div>
	);
}

export default App;
