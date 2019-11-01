export const fragmentShader = `
	varying vec2 vUv;

	uniform float opacity;
	uniform sampler2D map;

	vec3 hsl2rgb(vec3 c)
	{
		float t = c.y * ((c.z < 0.5) ? c.z : (1.0 - c.z));
		vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
		vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
		return (c.z + t) * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), 2.0*t / c.z);
	}

	void main(void)
	{
		/* Read a group of texels, doing a box blur */

		vec3 accumulator = vec3(0.0);
		vec2 dim_step = vec2(1.0/480.0) * 1.4;

		for (int i = -2; i < 2; ++i) {
			for (int j = -2; j < 2; ++j) {
				accumulator += texture2D(map, vUv + dim_step * vec2(i, j)).rgb;
			}
		}

		vec3 blur = accumulator / 16.0;

		/* Convert (RGB source) to greyscale luminance, by taking the Y
		 * component of YUV (multiplying by BT.709 coefficients) */

		vec3 coefficients = vec3(0.2126, 0.7152, 0.0722);
		float grey = dot(blur, coefficients);

		/* Adjust brightness */

		float brightness = 1.1;
		grey = clamp(grey * brightness, 0.0, 1.0);

		/* Posterize */

		float levels = (6.0) - 1.0;
		float posterized = floor((grey * levels) + 0.5) / levels;

		/* Increase contrast */

		float contrast = 1.4;
		float contrasted = clamp(contrast * (posterized - 0.5) + 0.5, 0.0, 1.0);

		/* Colourize! Choose a particular hue/saturation, and then pick colours
		 * by setting the lightness to the calculated value above */

		vec4 rgba = texture2D(map, vUv);

		vec3 rgb = hsl2rgb(vec3(0.6, 0.4, contrasted));
		gl_FragColor = vec4(vec3(rgb), 1.0) * .25 + rgba * .75;
		gl_FragColor.a = opacity;
	}

	/*void mainx() {
		vec4 rgba = texture2D(map, vUv);

		vec3 coefficients = vec3(0.2126, 0.7152, 0.0722);
		float grey = dot(coefficients, rgba.rgb);

		gl_FragColor = rgba;
		gl_FragColor.a = opacity;
		gl_FragColor.r += .5;
	}*/
`;
