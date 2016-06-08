var renderer, scene, camera, cube;
var hauteurFacette = 10;
var tailleMatrice;
var geometry, geometryPlane, material, ombre;
var grille, grilleCube;
var chrono = 0;

init();
setInterval(compteur, 1000);
animate();

function init(){
    // on initialise le moteur de rendu avec gestion de la transparence
    renderer = new THREE.WebGLRenderer({alpha : true});
	
    renderer.setSize( window.innerWidth*.75, window.innerHeight*.75 );
    document.getElementById('container').appendChild(renderer.domElement);

    // on initialise la scène
    scene = new THREE.Scene();
	
	// chargement de la grille depuis les fichiers de grilles
	grille = loadGrid();
	tailleMatrice = grille.length;
	grilleCube = loadCubes();
	var grilleZone = loadZones();
	var nbZone = countZones(grilleZone);

    // on initialise la camera que l’on place ensuite sur la scène
    camera = new THREE.PerspectiveCamera(Math.max(1.5*tailleMatrice, 15), window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0, 900, 430);
	camera.rotation.set(-1.1,0,0);
	
    scene.add(camera);
    
    // on crée un mesh correspondant au cube qui chute, auquel on attribue un matériau. Puis on l’ajoute à la scène
    geometry = new THREE.CubeGeometry( 20, 20, 20 );
	material = new Array();
	var materialValide = new Array();
	for(var k=0; k<tailleMatrice; k++){
		var img = new THREE.TextureLoader().load('img/tuileValide'+(k+1)+'.png');
		material.push(new THREE.MeshBasicMaterial( { map: img, color: 0xBBBBBB } ));
		img = new THREE.TextureLoader().load('img/tuileValide'+(k+1)+'.png');
		materialValide.push(new THREE.MeshBasicMaterial( { map: img, color: 0x33FF33 } ));
	}
	random = Math.round(Math.random() * (tailleMatrice -1));
    cube = new THREE.Mesh( geometry, material[random] );
	cube.position.set(0,200,0);
    scene.add( cube );
	
	// on crée l'ombre de notre cube de la même manière
	geometryPlane = new THREE.CubeGeometry( 20, 20, 190 );
    var materialPlane = new THREE.MeshBasicMaterial( { color: 0xDDDD55, wireframe: false, transparent: true, opacity: 0.6 } );
    ombre = new THREE.Mesh( geometryPlane, materialPlane );
	ombre.position.set(0,95,0);
	ombre.rotation.set(-3.14/2,0,0);
    scene.add( ombre );
	
	// On crée les propriétés de la grille
	var geometryBase = new THREE.CubeGeometry( 20, 2, 20 );
	var materialBase = [new THREE.MeshBasicMaterial( { color: 0x0000FF, wireframe: false } ),
						new THREE.MeshBasicMaterial( { color: 0x00FF00, wireframe: false } ),
						new THREE.MeshBasicMaterial( { color: 0xFF0000, wireframe: false } ),
						new THREE.MeshBasicMaterial( { color: 0xFF00FF, wireframe: false } ),
						new THREE.MeshBasicMaterial( { color: 0x00FFFF, wireframe: false } ),
						new THREE.MeshBasicMaterial( { color: 0xFFFF00, wireframe: false } ),
						new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: false } ),
						new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe: false } ),
						new THREE.MeshBasicMaterial( { color: 0x990099, wireframe: false } ),
						];
	
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
				emplacementBase = new THREE.Mesh( geometryBase, materialBase[grilleZone[j][i] -1] );
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
			if( grille[j][i] > 0) {
				tmp = new THREE.Mesh( geometry, materialValide[grille[j][i] -1] );
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
		cube.position.y -= 0.2;
		ombre.position.y -= 0.1;
		ombre.scale.z -= 1/950;
	}
	else {
		x = cube.position.x /22 + Math.floor(tailleMatrice /2);
		z = cube.position.z /22 + Math.floor(tailleMatrice /2);
		if(x<0 || x>=tailleMatrice || z<0 || z>=tailleMatrice || grille[z][x] != 0) { // Si on pose le cube en dehors de la grille
			scene.remove( cube );
		} else { // Si le cube est dans la grille
			console.log(grilleCube[z][x]);
			if (typeof grilleCube[z][x] != 'undefined') { // Si il y a deja un cube a cette position et qu'il n'est pas pose par defaut, on le supprime
				scene.remove(grilleCube[z][x]);
			}
			if (grille[z][x] == 0) {
				grilleCube[z][x] = cube;
			}
			verifierPosition(z, x, random);
		}
		random = Math.round(Math.random() * (tailleMatrice -1));
		cube = new THREE.Mesh( geometry, material[random] );
		cube.material.color.setHex( 0xBBBBBB );
		cube.position.set(0,200,0);
		scene.add( cube );
		ombre.position.set(0,95,0);
		ombre.scale.z = 1;
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

function verifierPosition(x, z, value, cubePose) {
	if (value == 1 || value == 2 || value == 3) {
		cube.material.color.setHex( 0xFF3333 ); // On doit faire une nouvelle texture, sinon toutes les textures de meme valeurs se changent en meme temps
	}
}

function loadGrid(){
	return [[0,0,0,2,0,0,0,0,0],
			[0,8,0,0,3,0,0,7,0],
			[3,0,0,5,0,4,0,0,0],
			[0,0,0,0,0,0,0,2,8],
			[8,3,0,0,1,0,0,0,0],
			[0,4,0,7,2,0,3,5,1],
			[0,7,0,0,5,6,0,0,4],
			[0,0,3,0,0,0,0,0,0],
			[2,0,5,4,0,1,6,0,3]];
}

function loadGrid4(){
	return [[0,0,0,2],
			[0,1,0,0],
			[3,0,0,1],
			[0,0,0,0]];
}

function loadEmptyGrid(){
	return [[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0]];
}

function loadEmptyGrid4(){
	return [[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0]];
}

function loadCubes() {
	var grilleTmp = new Array();
	for (var i=0; i<tailleMatrice; i++) {
		grilleTmp.push(new Array(tailleMatrice));
	}
	return grilleTmp;
}

function loadZones(){
	return [[1,1,1,2,2,2,3,3,3],
			[1,1,1,2,2,2,3,3,3],
			[1,1,1,2,2,2,3,3,3],
			[4,4,4,5,5,5,6,6,6],
			[4,4,4,5,5,5,6,6,6],
			[4,4,4,5,5,5,6,6,6],
			[7,7,7,8,8,8,9,9,9],
			[7,7,7,8,8,8,9,9,9],
			[7,7,7,8,8,8,9,9,9]];
}

function loadZones4(){
	return [[1,1,2,2],
			[1,1,2,2],
			[3,3,4,4],
			[3,3,4,4]];
}

function countZones(grilleZone){
	var eltPresents = new Set();
	for (var i=0; i<grilleZone.length; i++) {
		for (var j=0; j<grilleZone[i].length; j++) {
			eltPresents.add(grilleZone[i][j]);
		}
	}
	return eltPresents.size;
}

function compteur(){
	chrono ++;
	var secondes = chrono % 60;
	var minutes = ((chrono - secondes) / 60) % 60;
	var heures = (chrono - secondes - 60*minutes) / 3600;
	var chronoHTML = document.getElementById("chrono");
	chronoHTML.innerHTML = (heures < 10 ? '0' + heures : heures) +":"
		+ (minutes < 10 ? '0' + minutes : minutes)+":"
		+ (secondes < 10 ? '0' + secondes : secondes);
}