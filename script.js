var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var sun;
var ground;

var rollingGroundSphere;
var heroSphere;
var rollingSpeed=0.008;
var heroRollingSpeed;
var worldRadius=26;
var heroRadius=0.2;
var sphericalHelper;
var pathAngleValues;
var heroBaseY=1.8;
var bounceValue=0.1;
var gravity=0.005;
var leftLane=-1;
var rightLane=1;
var middleLane=0;
var currentLane;
var clock;
var jumping;
var treeReleaseInterval=0.5;
var lastTreeReleaseTime=0;
var treesInPath;
var treesPool;
var particleGeometry;
var particleCount=35;
var explosionPower =1.;
var particles;

init();

function init() {

	createScene();


	update();
}

function createScene(){
	hasCollided=false;
	score=0;
	treesInPath=[];
	treesPool=[];
	clock=new THREE.Clock();
	clock.start();
	heroRollingSpeed=(rollingSpeed*worldRadius/heroRadius)/5;
	sphericalHelper = new THREE.Spherical();
	pathAngleValues=[1.52,1.57,1.62];
    sceneWidth=window.innerWidth;
    sceneHeight=window.innerHeight;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xffa5000, 0.14 );
    camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.setClearColor(0xffa500, 1); 
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize( sceneWidth, sceneHeight );
    dom = document.getElementById('game');
	dom.appendChild(renderer.domElement);

	createTreesPool();
	addWorld();
	addHero();
	addLight();
	addExplosion();
	
	camera.position.z = 7.5;
	camera.position.y = 3;
	
	window.addEventListener('resize', onWindowResize, false);

	document.onkeydown = handleKeyDown;
	
	scoreText = document.createElement('div');
	scoreText.style.position = 'absolute'; 
	scoreText.style.width = 100;
	scoreText.style.height = 100;
	scoreText.innerHTML = "0";
	scoreText.style.top = 50 + 'px';
	scoreText.style.left = 10 + 'px';
	document.body.appendChild(scoreText);
}
function addExplosion(){
	particleGeometry = new THREE.Geometry();
	for (var i = 0; i < particleCount; i ++ ) {
		var vertex = new THREE.Vector3();
		particleGeometry.vertices.push( vertex );
	}
	var pMaterial = new THREE.ParticleBasicMaterial({
	  color: 0x5d782e,
	  size: 0.2
	});
	particles = new THREE.Points( particleGeometry, pMaterial );
	scene.add( particles );
	particles.visible=false;
}
function createTreesPool(){
	var maxTreesInPool=10;
	var newTree;
	for(var i=0; i<maxTreesInPool;i++){
		newTree=createTree();
		treesPool.push(newTree);
	}
}
function handleKeyDown(keyEvent){
	if(jumping)return;
	var validMove=true;
	if ( keyEvent.keyCode === 37) {//left
		if(currentLane==middleLane){
			currentLane=leftLane;
		}else if(currentLane==rightLane){
			currentLane=middleLane;
		}else{
			validMove=false;	
		}
	} else if ( keyEvent.keyCode === 39) {//right
		if(currentLane==middleLane){
			currentLane=rightLane;
		}else if(currentLane==leftLane){
			currentLane=middleLane;
		}else{
			validMove=false;	
		}
	}else{
		if ( keyEvent.keyCode === 38){//up, jump
			bounceValue=0.1;
			jumping=true;
		}
		validMove=false;
	}
	if(validMove){
		jumping=true;
		bounceValue=0.06;
	}
}
function addHero(){
	var sphereGeometry = new THREE.DodecahedronGeometry( heroRadius, 0);
	var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0x398ccc,shading:THREE.FlatShading} )
	jumping=false;
	heroSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
	heroSphere.receiveShadow = true;
	heroSphere.castShadow=true;
	scene.add( heroSphere );
	heroSphere.position.y=heroBaseY;
	heroSphere.position.z=4.8;
	currentLane=middleLane;
	heroSphere.position.x=currentLane;
}

function addWorld(){
	var sides=40;
	var tiers=44;
	var sphereGeometry = new THREE.SphereGeometry( worldRadius, sides,tiers);
	var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xfffafa ,shading:THREE.FlatShading} )
	
	var vertexIndex;
	var vertexVector= new THREE.Vector3();
	var nextVertexVector= new THREE.Vector3();
	var firstVertexVector= new THREE.Vector3();
	var offset= new THREE.Vector3();
	var currentTier=1;
	var lerpValue=0.5;
}