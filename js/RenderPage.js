var container, scene, camera, renderer, controls, stats;
var clock = new THREE.Clock();
var sofa,curtain,person,parameters,gui;

init();
animate();

function init() {
    var curtainJsonUrlInit = "obj/curtain01/curtain01.js";
    var sofaJsonUrlInit = "obj/sofa01/sofa01.js";
    var curtainImageUrlInit = "materials/A.jpg";
    var sofaImageUrlInit = "materials/A.jpg";
    var personJsonUrlInit = "obj/person01/person01.js";
    var wallpaperInit = "images/wallpaper/wallpaper.jpg";
    var floorImageInit = "images/floor/floor.jpg";
    var curtainStyleList = ["01", "02"];
    var curtainMaterialList =  ["A", "B", "C", "E", "F", "G", "H", "I", "K", "M", "N", "P", "Q", "R", "S", "T", "U"];
    var sofaStyleList = ["01", "02"];
    var sofaMaterialList = ["A", "B", "C", "E", "F", "G", "H", "I", "K", "M", "N", "P", "Q", "R", "S", "T", "U"];
    var personStyleList = ["01", "03"];
    var personMaterialList = ["A", "B", "C", "E", "F", "G", "H", "I", "K", "M", "N", "P", "Q", "R", "S", "T", "U"];
    sceneInit();
    cameraInit();
    container = document.getElementById('show');
    container.appendChild(renderer.domElement);
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({charCode: 'm'.charCodeAt(0)});
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    statsInit();
    lightInit();
    loadJSONModel(curtainJsonUrlInit,curtainImageUrlInit,"curtain",0,-200,-300,1.0,1.0,1.0,0);
    loadJSONModel(sofaJsonUrlInit,sofaImageUrlInit,"sofa",-200,-200,0,1.0,1.0,1.0,90);
    loadJSONModel(personJsonUrlInit,"","person",200, -200, 60,1.0,1.0,1.0,0);
    spaceInit(wallpaperInit,floorImageInit);
    guiInit(curtainStyleList,curtainMaterialList,sofaStyleList,sofaMaterialList,personStyleList,personMaterialList)
}

function sceneInit(){
    scene = new THREE.Scene();
//        scene.fog = new THREE.Fog( 0xcce0ff, 50, 500 );
}

function cameraInit(){
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 30, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 10000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 50, 1000);
    camera.lookAt(scene.position);
    if (Detector.webgl)
        renderer = new THREE.WebGLRenderer({antialias: true});
    else
        renderer = new THREE.CanvasRenderer();
    renderer.shadowMapEnabled = true;
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
}

function statsInit(){
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 10;
    container.appendChild(stats.domElement);
}

function lightInit(){
    var light;
    scene.add(new THREE.AmbientLight(0x666666));
    light = new THREE.DirectionalLight(0xdfebff, 1.00);
    light.position.set(50, 200, 100);
    light.position.multiplyScalar(1.3);
    light.castShadow = true;
    // light.shadowCameraVisible = true;
//        light.shadow.mapSize.width = 1024;
//        light.shadow.mapSize.height = 1024;
//        var d = 3000;
//        light.shadow.camera.left = -d;
//        light.shadow.camera.right = d;
//        light.shadow.camera.top = d;
//        light.shadow.camera.bottom = -d;
//        light.shadow.camera.far = 1000;
    scene.add(light);
}

// function objInit(materialUrl,objUrl,objType,x,y,z,r){
//     var manager = new THREE.LoadingManager();
//     manager.onProgress = function (item, loaded, total) {
//         console.log(item, loaded, total);
//     };
//     var texture = new THREE.Texture();
//     var onProgress = function (xhr) {
//         if (xhr.lengthComputable) {
//             var percentComplete = xhr.loaded / xhr.total * 100;
//             console.log(Math.round(percentComplete, 2) + '% downloaded');
//         }
//     };
//     var onError = function (xhr) {
//     };
//     var loader = new THREE.ImageLoader(manager);
//     loader.load(materialUrl
//         , function (image) {
//             texture.image = image;
//             texture.needsUpdate = true;
//         }
//     );
//     var loader = new THREE.OBJLoader(manager);
//     loader.load(objUrl, function (object) {
//             object.traverse(function (child) {
//                 if (child instanceof THREE.Mesh) {
//                     child.material.map = texture;
//                 }
//             });
//             if(objType == "curtain")
//             {
//                 curtain = object;
//             }
//             else if (objType == "sofa")
//             {
//                 sofa = object;
//             }
//             object.position.set(x, y, z);
//             object.rotation.y = Math.PI * r / 180;
//             object.castShadow = true;
//             scene.add(object);
//         }, onProgress, onError
//     );
// }

function loadJSONModel(jsonUrl,materialUrl,modelType,x,y,z,a,b,c,r){
    var loader = new THREE.JSONLoader();
    var callback = function ( geometry, materials ) { createModel( geometry, materials, materialUrl,modelType,x,y,z,a,b,c,r) };
    loader.load( jsonUrl,callback);
}

function createModel( geometry, materials, materialUrl,modelType,x,y,z,a,b,c,r){
    var m;
    if (materialUrl==""||materialUrl==null||materialUrl==undefined)
    {
        m = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) );
    }
    else
    {
        var texture = new THREE.Texture();
        var loader = new THREE.ImageLoader();
        loader.load(materialUrl
            , function (image) {
                texture.image = image;
                texture.needsUpdate = true;
            }
        );
        var materialImage = new THREE.MeshBasicMaterial( { map: texture } );
        m = new THREE.Mesh( geometry, materialImage);
    }
    if(modelType == "curtain")
    {
        curtain = m;
    }
    else if(modelType == "sofa")
    {
        sofa = m;
    }
    else if(modelType == "person")
    {
        person = m;
    }
    m.position.set( x, y, z );
    m.scale.set( a, b, c );
    m.rotation.y = Math.PI * r / 180;
    scene.add( m );
}

// function personObjInit(){
//     var onProgress = function (xhr) {
//         if (xhr.lengthComputable) {
//             var percentComplete = xhr.loaded / xhr.total * 100;
//             console.log(Math.round(percentComplete, 2) + '% downloaded');
//         }
//     };
//
//     var onError = function (xhr) {
//     };
//
//     THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
//
//     var mtlLoader = new THREE.MTLLoader();
//     mtlLoader.setBaseUrl('obj/person02/');
//     mtlLoader.setPath('obj/person02/');
//     mtlLoader.load('male02_dds.mtl', function (materials) {
//         materials.preload();
//         var objLoader = new THREE.OBJLoader();
//         objLoader.setMaterials(materials);
//         objLoader.setPath('obj/person02/');
//         objLoader.load('male02.obj', function (object) {
//             object.position.set(200, -200, 60);
//             preson = object;
//             scene.add(object);
//         }, onProgress, onError);
//
//     });
// }

function spaceInit(wallpaper,floorImage){
    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load(floorImage);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(5, 5);
    groundTexture.anisotropy = 16;
    var groundMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0x111111, map: groundTexture});
    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(800, 800), groundMaterial);
    mesh.position.y = -200;
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);
//        var imagePrefix = "images/dawnmountain-";
//        var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
//        var imageSuffix = ".png";
    var skyGeometry = new THREE.CubeGeometry(800, 800, 800);
    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(wallpaper),
            side: THREE.BackSide
        }));
    var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyBox);
}

function guiInit(curtainStyleParam,curtainMaterialParam,sofaStyleParam,sofaMaterialParam,personStyleParam,personMaterialParam){
    gui = new dat.GUI();

    parameters =
    {
        curtainStyleValue: '01',
        curtainMaterialValue: 'A',
        curtainVisibleValue: true,
        sofaStyleValue: '01',
        sofaMaterialValue: 'A',
        sofaVisibleValue: true,
        personStyleValue: '01',
        personMaterialValue: '',
        personVisibleValue: true,
        reset: function () {
            reset()
        }
    };

    var folderCurtain = gui.addFolder('窗帘控制台');
    var curtainStyle = folderCurtain.add(parameters, 'curtainStyleValue', curtainStyleParam).name('款式').listen();
    curtainStyle.onChange(function (value) {
        changeStyle("curtain",value);
    });
    var curtainMaterial = folderCurtain.add(parameters, 'curtainMaterialValue', curtainMaterialParam).name('材质').listen();
    curtainMaterial.onChange(function (value) {
        changeMaterial("curtain",value);
    });
    var curtainVisible = folderCurtain.add(parameters, 'curtainVisibleValue').name('是否可见').listen();
    curtainVisible.onChange(function (value) {
        curtain.visible = value;
    });
    folderCurtain.close();

    var folderSofa = gui.addFolder('沙发控制台');
    var sofaStyle = folderSofa.add(parameters, 'sofaStyleValue', sofaStyleParam).name('款式').listen();
    sofaStyle.onChange(function (value) {
        changeStyle("sofa",value);
    });
    var sofaMaterial = folderSofa.add(parameters, 'sofaMaterialValue', sofaMaterialParam).name('材质').listen();
    sofaMaterial.onChange(function (value) {
        changeMaterial("sofa",value);
    });
    var sofaVisible = folderSofa.add(parameters, 'sofaVisibleValue').name('是否可见').listen();
    sofaVisible.onChange(function (value) {
        sofa.visible = value;
    });
    folderSofa.close();

    var folderPerson = gui.addFolder('人物控制台');
    var personStyle = folderPerson.add(parameters, 'personStyleValue', personStyleParam).name('人物').listen();
    personStyle.onChange(function (value) {
        changeStyle("person",value);
    });
    var personMaterial = folderPerson.add(parameters, 'personMaterialValue', personMaterialParam).name('材质').listen();
    personMaterial.onChange(function (value) {
        changeMaterial("person",value);
    });
    var personVisible = folderPerson.add(parameters, 'personVisibleValue').name('是否可见').listen();
    personVisible.onChange(function (value) {
        person.visible = value;
    });
    folderPerson.close();
    gui.add(parameters, 'reset').name("重置");
    gui.close();
}

function changeStyle(modelType,value){
    if(modelType == "curtain")
    {
        scene.remove(curtain);
        var imageValue = "materials/" + parameters.curtainMaterialValue + ".jpg";
        var styleValue = 'obj/curtain' + value + '/curtain' + value + '.js';
        loadJSONModel(styleValue,imageValue,"curtain",0,-200,-300,1.0,1.0,1.0,0);
    }
    else if(modelType == "sofa")
    {
        scene.remove(sofa);
        var imageValue = "materials/" + parameters.sofaMaterialValue + ".jpg";
        var styleValue = 'obj/sofa' + value + '/sofa' + value + '.js';
        loadJSONModel(styleValue,imageValue,"sofa",-200,-200,0,1.0,1.0,1.0,90);
    }
    else if(modelType == "person")
    {
        scene.remove(person);
        var styleValue = 'obj/person' + value + '/person' + value + '.js';
        loadJSONModel(styleValue,"","person",200, -200, 60,1.0,1.0,1.0,0);
    }
}

function changeMaterial(modelType,value){
    var texture = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    var changeMaterialUrl = 'materials/' + value + '.jpg';
    var loader = new THREE.ImageLoader();
    loader.load(changeMaterialUrl
        , function (image) {
            texture.image = image;
            texture.needsUpdate = true;
        }
    );
    materialImageNew = new THREE.MeshBasicMaterial(  { map: texture } );
    if(modelType == "curtain")
    {
        curtain.material = materialImageNew;
    }
    else if(modelType == "sofa")
    {
        sofa.material = materialImageNew;
    }
    else if(modelType == "person")
    {
        person.material = materialImageNew;
    }
}

// function changeMaterial(objType){
//     if(objType == "curtain")
//     {
//         var changeMaterialUrl = 'materials/' + parameters.curtainMaterialValue + '.jpg';
//     }
//     else if(objType == "sofa")
//     {
//         var changeMaterialUrl = 'materials/' + parameters.sofaMaterialValue + '.jpg';
//     }
//     var manager = new THREE.LoadingManager();
//     manager.onProgress = function (item, loaded, total) {
//         console.log(item, loaded, total);
//     };
//     var texture = new THREE.Texture();
//     var onProgress = function (xhr) {
//         if (xhr.lengthComputable) {
//             var percentComplete = xhr.loaded / xhr.total * 100;
//             console.log(Math.round(percentComplete, 2) + '% downloaded');
//         }
//     };
//     var onError = function (xhr) {
//     };
//     var loader = new THREE.ImageLoader(manager);
//     loader.load(changeMaterialUrl
//         , function (image) {
//             texture.image = image;
//             texture.needsUpdate = true;
//         }
//     );
//     if(objType == "curtain")
//     {
//         curtain.traverse(function (child) {
//             if (child instanceof THREE.Mesh) {
//                 child.material.map = texture;
//             }
//         });
//         curtain.visible = parameters.curtainVisibleValue;
//     }
//     else if(objType == "sofa")
//     {
//         sofa.traverse(function (child) {
//             if (child instanceof THREE.Mesh) {
//                 child.material.map = texture;
//             }
//         });
//         sofa.visible = parameters.sofaVisibleValue;
//     }
// }

function reset() {
    curtain.position.set(0, -200, -300);
    parameters.curtainStyleValue = "01";
    parameters.curtainMaterialValue = "A";
    parameters.curtainVisibleValue = true;
    sofa.position.set(-200, -200, 0);
    sofa.rotation.y = Math.PI * 90 / 180;
    parameters.sofaStyleValue = "01";
    parameters.sofaMaterialValue = "A";
    parameters.sofaVisibleValue = true;
    person.position.set(0, -200, -300);
    parameters.personStyleValue = "01";
    parameters.personMaterialValue = "A";
    parameters.personVisibleValue = true;
    changeStyle("curtain",parameters.curtainStyleValue)
    changeMaterial("curtain",parameters.curtainMaterialValue);
    changeStyle("sofa",parameters.sofaStyleValue)
    changeMaterial("sofa",parameters.sofaMaterialValue);
    scene.remove(person);
    loadJSONModel("obj/person01/person01.js","","person",200, -200, 60,1.0,1.0,1.0,0);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

function update() {
    var delta = clock.getDelta();
    controls.update();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}