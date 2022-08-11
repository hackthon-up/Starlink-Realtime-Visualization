# Starlink-Realtime-Visualization

![react](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![javascript](https://img.shields.io/badge/JavaScript-20232A?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)
![node.js](https://img.shields.io/badge/Node.js-20232A?style=for-the-badge&logo=nodedotjs&logoColor=green)
![Express](https://img.shields.io/badge/-Express-20232A?style=for-the-badge&logo=express&logoColor=yellow)
![Webpack](https://img.shields.io/badge/-webpack-20232A?style=for-the-badge&logo=webpack&logoColor=blueviolet)
![Babel](https://img.shields.io/badge/-Babel-20232A?style=for-the-badge&logo=babel&logoColor=yellow)

This project was a personal challenge to learn new technologies (`three.js` and `react-three-fiber`) and build an application in under three days.

Starlink Tracker tracks real-time data of Starlink satellites and positions them in the 3D world in a fixed orbit based on their current latitude/longitude coordinates. 

## [Live Demo](http://52.15.37.131:8080/)

<p
  align="center">
  <img
    alt="starlink tracker demo" src="client/demo/Starlink GIF Shortened Compressed GIF (high).gif">
</p>

## Installation
1. Install dependencies
   ```sh
   npm install
   ```
   
2. Run 
   ```sh
   npm start
   ```
   
## Usage

### Click, Hover, Drag
 - Information for the selected Starlink satellite will be displayed. Hover over another Starlink to change selections.
 - Click and drag the center object to point the camera to another part of the world.
 - Scroll down for more visual effects.
 - Click either of the two 3D satellite models for an easter egg!

## Features

### Accurate Positioning
One of the challenges I faced was placing the Starlink satellites based on their actual positional data to ensure that my rendition was to scale. In `three.js` there are a variety of ways to position objects in the 3D space - cartesian coordinates (x, y, z), spherical coordinates (r, phi, theta), and so on. The trick was to convert the satellites' latitude/longitude into a coordinate system that could be used for positioning. Fortunately there's a simple way to do this - first by converting into ellipsoidal coordinates, then into cartesian:

<details><summary>Show code</summary>
<p>
  
  ```js
  // Helper function for converting coordinates [longitude, latitude] into a THREE.Vector3 in (x, y, z) plane
  // Points will be positioned according to a given radius from the center
  const vertex = (point, radius) => {
    const lambda = point[0] * Math.PI / 180;
    const phi = point[1] * Math.PI / 180;
    const cosPhi = Math.cos(phi);
  
    const x = radius * cosPhi * Math.cos(lambda);
    const y = radius * cosPhi * Math.sin(lambda);
    const z = radius * Math.sin(phi);
  
    return [x, y, z];
  }
  ```

</p>
</details>

### Isolated Camera Controls 
I wanted my camera's orbit controls to be restricted to the center geometric object - so that only by clicking and dragging this object could the user rotate the camera to view other parts of the world; not by clicking and dragging anywhere else on the screen. The key was to take advantage of the `enableRotate` property on the orbit controls, which allows the user to rotate the camera. By tying the `enableRotate` property to an `enabled` state I created, I ensured that only when the user hovers the cursor over the center object would he or she be able to rotate the camera manually. 

<details><summary>Show code</summary>
<p>
  
  ```js
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import EdgeShape from './EdgeShape.jsx';
  
  extend({ OrbitControls });

  const CameraControls = () => {
    const [enabled, setEnabled] = useState(false);
    const controls = useRef();

    const {
      camera,
      gl: { domElement },
    } = useThree();

    useFrame(() => {
      controls.current.update();
    });

    return (
      <>
        <orbitControls
          ref={controls}
          args={[camera, domElement]}
          autoRotate={true}
          autoRotateSpeed={1}
          enableRotate={enabled ? true : false}
          enableZoom={false}
        />
        <EdgeShape setEnabled={setEnabled} />
      </>
    );
  };
  ```

</p>
</details>

### Starlink Nametags
Selected Starlink satellites are given an HTML tag indicating the Starlink name. This was accomplished using the `<HTML>` component from the `react-three/drei` library, which renders HTML content alongside any object in the scene. The problem is that although `<HTML>` components appear as if they were part of the 3D scene, in reality they behave like regular HTML tags and belong to the normal flow of the DOM. This means that if the user scrolls, the nametags would also scroll and drift away from the satellite they were assigned to. To account for this I tracked the scroll position and utilized state to hide nametags whenever the page was scrolled.

<details><summary>Show code</summary>
<p>
  
  ```js
  const [showStarlinkName, setShowStarlinkName] = useState(true);
  
  useEffect(() => {
    document.body.onscroll = () => {
      const t = document.body.getBoundingClientRect().top;
      if (t < 0) {
        setShowStarlinkName(false);
      } else {
        setShowStarlinkName(true);
      }
    }
  }, []);
  ```

</p>
</details>

## Future Plans
Some ideas I'd like to implement in the future:
 - Overlays with instructions on how to interact with the application - one for each feature.
 - Allow users to toggle through additional sets of Starlink satellites using forward/back buttons.
 - Option for users to render any number of Starlink satellites at a time (via slider bar)
