var renderer, scene, camera, cube;
var hauteurFacette = 10;
var tailleMatrice;
var geometry, material, ombre;
var grille;

init();
animate();

function init(){
    // on initialise le moteur de rendu
    renderer = new THREE.WebGLRenderer();

    // si WebGL ne fonctionne pas sur votre navigateur vous pouvez utiliser le moteur de rendu Canvas à la place
    // renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth*.85, window.innerHeight*.85 );
    document.getElementById('container').appendChild(renderer.domElement);

    // on initialise la scène
    scene = new THREE.Scene();
	
	// chargement de la grille depuis les fichiers de grilles
	grille = loadGrid();
	tailleMatrice = grille.length;

    // on initialise la camera que l’on place ensuite sur la scène
    camera = new THREE.PerspectiveCamera(Math.max(1.5*tailleMatrice, 15), window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0, 900, 450);
	camera.rotation.set(-1.1,0,0);
	
    scene.add(camera);
    
    // on crée un mesh correspondant au cube qui chute, auquel on attribue un matériau. Puis on l’ajoute à la scène
    geometry = new THREE.CubeGeometry( 20, 20, 20 );
	material = new Array();
	for(var k=0; k<tailleMatrice; k++){
		var img = new THREE.TextureLoader().load('img/tuile'+(k+1)+'.jpg');
		material.push(new THREE.MeshBasicMaterial( { map: img } ));
	}
	random = Math.round(Math.random() * (tailleMatrice -1));
    cube = new THREE.Mesh( geometry, material[random] );
	cube.position.set(0,200,0);
    scene.add( cube );
	
	// on crée l'ombre de notre cube de la même manière
    var geometryPlane = new THREE.PlaneGeometry(20, 20);
    var materialPlane = new THREE.MeshBasicMaterial( { color: 0xCCCCCC, wireframe: true } );
    ombre = new THREE.Mesh( geometryPlane, materialPlane );
	ombre.position.set(0,hauteurFacette/5,0);
	ombre.rotation.set(-3.14/2,0,0);
    scene.add( ombre );
	
	// On crée les propriétés de la grille
	var geometryBase = new THREE.CubeGeometry( 20, 2, 20 );
	var materialBase = new THREE.MeshBasicMaterial( { color: 0x0000FF, wireframe: false } );
	
	var geometryFacetteGD = new THREE.CubeGeometry( 1, hauteurFacette, 20 );
	var materialFacetteGD = new THREE.MeshBasicMaterial( { color: 0x555555, wireframe: false } );
	
	var geometryFacetteHaut = new THREE.CubeGeometry( 22, hauteurFacette, 1 );
	var materialFacetteHaut = new THREE.MeshBasicMaterial( { color: 0xAAAAAA, wireframe: false } );
	
	var geometryFacetteBasse = new THREE.CubeGeometry( 22, hauteurFacette, 1 );
	var materialFacetteBasse = new THREE.MeshBasicMaterial( { color: 0x555555, wireframe: false } );
	
	var decalageX, decalageY;
			
	// on créé plusieurs mesh auquel on définit un matériau puis on les ajoute à la scène
	for (var i=0; i<tailleMatrice; i++) {
		for (var j=0; j<tailleMatrice; j++) {
			decalageX = 22*(i - Math.floor(tailleMatrice /2));
			decalageY = 22*(j - Math.floor(tailleMatrice /2));
			
			if(grille[j][i] > -1) {
				// Base de l'emplacement
				emplacementBase = new THREE.Mesh( geometryBase, materialBase );
				emplacementBase.position.set(decalageX, 0, decalageY);
				scene.add( emplacementBase );
				
				//facette gauche
				emplacementFacetteGD = new THREE.Mesh( geometryFacetteGD, materialFacetteGD );
				emplacementFacetteGD.position.set(decalageX -10.5,hauteurFacette/2,decalageY);
				scene.add( emplacementFacetteGD );
				
				//facette droite
				emplacementFacetteGD = new THREE.Mesh( geometryFacetteGD, materialFacetteGD );
				emplacementFacetteGD.position.set(decalageX +10.5,hauteurFacette/2,decalageY);
				scene.add( emplacementFacetteGD );
				
				//facette haute
				emplacementFacetteHaut = new THREE.Mesh( geometryFacetteHaut, materialFacetteHaut );
				emplacementFacetteHaut.position.set(decalageX, hauteurFacette/2, decalageY -10.5);
				scene.add( emplacementFacetteHaut );
				
				//facette basse
				emplacementFacetteBasse = new THREE.Mesh( geometryFacetteBasse, materialFacetteBasse );
				emplacementFacetteBasse.position.set(decalageX, hauteurFacette/2, decalageY +10.5);
				scene.add( emplacementFacetteBasse );
			}
			if( grille[i][j] > 0) {
				tmp = new THREE.Mesh( geometry, material[grille[i][j] -1] );
				tmp.position.set(decalageX,10.2,decalageY);
				scene.add( tmp );
			}
		}
	}
	
	
}

function animate(){
    // on appelle la fonction animate() récursivement à chaque frame
    requestAnimationFrame( animate );
    // on fait "tomber" le cube le long de l'axe y
	if (cube.position.y > 10.2) {
		cube.position.y -= 1;
	}
	else {
		x = cube.position.x /22 + Math.floor(tailleMatrice /2);
		z = cube.position.z /22 + Math.floor(tailleMatrice /2);
		if(x<0 || x>=tailleMatrice || z<0 || z>=tailleMatrice || grille[z][x] != 0) {
			scene.remove( cube );
		}
		random = Math.round(Math.random() * (tailleMatrice -1));
		console.log(random);
		cube = new THREE.Mesh( geometry, material[random] );
		cube.position.set(0,200,0);
		scene.add( cube );
		ombre.position.set(0,hauteurFacette/5,0);
	}
    // on effectue le rendu de la scène
    renderer.render( scene, camera );
}

function moveCube(e){
	if (cube.position.y > 10.1) {
		if (e.keyCode == 37 || e.keyCode == 39) {
			cube.position.x += (e.keyCode - 38) *22;
			ombre.position.x += (e.keyCode - 38) *22;
		}
		else if (e.keyCode == 38 || e.keyCode == 40) {
			cube.position.z += (e.keyCode - 39) *22;
			ombre.position.z += (e.keyCode - 39) *22;
		}
		else if (e.which == 48 && cube.position.y > 12) {
			cube.position.y -= 1;
		}
	}
}

function loadGrid(){
	return [[0,0,0,2,0,0,0,-1,0],
			[0,8,0,0,3,0,0,7,0],
			[3,0,0,5,0,4,0,0,0],
			[0,0,0,0,0,0,0,2,8],
			[8,3,0,0,1,0,0,0,0],
			[0,4,0,7,2,0,3,5,1],
			[0,7,0,0,5,6,0,0,4],
			[0,0,3,0,0,0,0,0,0],
			[2,0,5,4,0,1,6,0,3]];
}