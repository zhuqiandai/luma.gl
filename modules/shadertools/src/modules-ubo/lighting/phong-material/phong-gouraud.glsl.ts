import {glsl} from '../../../lib/glsl-utils/highlight';

export const PHONG_GOURAUD_UNIFORMS = glsl`\
uniform phongMaterialUniforms {
  uniform float ambient;
  uniform float diffuse;
  uniform float shininess;
  uniform vec3  specularColor;
} material;
`;

export const PHONG_GOURAUD_SHADER = glsl`\
uniform phongMaterialUniforms {
  uniform float ambient;
  uniform float diffuse;
  uniform float shininess;
  uniform vec3  specularColor;
} material;

vec3 lighting_getLightColor(vec3 surfaceColor, vec3 light_direction, vec3 view_direction, vec3 normal_worldspace, vec3 color) {
  vec3 halfway_direction = normalize(light_direction + view_direction);
  float lambertian = dot(light_direction, normal_worldspace);
  float specular = 0.0;
  if (lambertian > 0.0) {
    float specular_angle = max(dot(normal_worldspace, halfway_direction), 0.0);
    specular = pow(specular_angle, material.shininess);
  }
  lambertian = max(lambertian, 0.0);
  return (lambertian * material.diffuse * surfaceColor + specular * material.specularColor) * color;
}

vec3 lighting_getLightColor(vec3 surfaceColor, vec3 cameraPosition, vec3 position_worldspace, vec3 normal_worldspace) {
  vec3 lightColor = surfaceColor;

  if (lighting.enabled) {
    vec3 view_direction = normalize(cameraPosition - position_worldspace);
    lightColor = material.ambient * surfaceColor * lighting.ambientLight.color;

    for (int i = 0; i < MAX_LIGHTS; i++) {
      if (i >= lighting.pointLightCount) {
        break;
      }
      PointLight pointLight = lighting.pointLight[i];
      vec3 light_position_worldspace = pointLight.position;
      vec3 light_direction = normalize(light_position_worldspace - position_worldspace);
      lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color);
    }

    for (int i = 0; i < MAX_LIGHTS; i++) {
      if (i >= lighting.directionalLightCount) {
        break;
      }
      DirectionalLight directionalLight = lighting.directionalLight[i];
      lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
    }
  }
  return lightColor;
}

vec3 lighting_getSpecularLightColor(vec3 cameraPosition, vec3 position_worldspace, vec3 normal_worldspace) {
  vec3 lightColor = vec3(0, 0, 0);
  vec3 surfaceColor = vec3(0, 0, 0);

  if (lighting.enabled) {
    vec3 view_direction = normalize(cameraPosition - position_worldspace);

    for (int i = 0; i < MAX_LIGHTS; i++) {
      if (i >= lighting.pointLightCount) {
        break;
      }
      PointLight pointLight = lighting_getPointLight(i);
      vec3 light_position_worldspace = pointLight.position;
      vec3 light_direction = normalize(light_position_worldspace - position_worldspace);
      lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color);
    }

    for (int i = 0; i < MAX_LIGHTS; i++) {
      if (i >= lighting.directionalLightCount) {
        break;
      }
      PointLight pointLight = lighting_getDirectionalLight(i);
      lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
    }
  }
  return lightColor;
}
`;
