export const fragmentShader = `
	varying vec2 vUv;

	uniform float opacity;
	uniform sampler2D map;

	void main() {
		vec4 rgba = texture2D(map, vUv);
		gl_FragColor = rgba;
		gl_FragColor.a = opacity;
		gl_FragColor.r += .5;
	}
`;
