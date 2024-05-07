//import {Scene} from "./modules/game/gameObject.js"
//import {Render, ShaderLib} from  "./modules/render/frameRender.js"

//const canvas = document.querySelector("#glcanvas");
//const gl = canvas.getContext("webgl2");

//const scene = new Scene("../data/stage.json", "../data/scene.json", '../models'); 
//const shaders = new ShaderLib("./shaders/materials.json", gl);
//const render = new Render(gl);

function APP()
{
    var currentActiveObject = null;
    const canvas = document.querySelector('#glcanvas');
    const pageX = document.querySelector('#x');
    const pageY = document.querySelector('#y');

    const nX = document.querySelector('#nx');
    const nY = document.querySelector('#ny');
    return;

    function updateDisplay(event)
    {
        const rect = canvas.getBoundingClientRect()
        const absTop = rect.top + window.scrollY;
        const absLeft = rect.left + window.scrollX;
        pageX.innerHTML = event.pageX;
        pageY.innerHTML = event.pageY;

        const cv = document.getElementById('glcanvas');
        
        nX.innerHTML = (event.pageX - absLeft) / cv.width;
        nY.innerHTML = (event.pageY - absTop) / cv.height;
    }

    function resetDisplay(event)
    {
        pageX.innerHTML = -1;
        pageY.innerHTML = -1;
    }

    function captureMouseData(event)
    {
        const clickFrame = document.getElementById('frame');
        const clickdt = document.getElementById('clickdt');
        const clickx = document.getElementById('cx');
        const clicky = document.getElementById('cy');

        clickdt.innerHTML = clickFrame.textContent;
        clickx.innerHTML =  document.getElementById('nx').textContent;
        clicky.innerHTML =  document.getElementById('ny').textContent;
    }

    canvas.addEventListener('mousemove', updateDisplay, false);
    canvas.addEventListener('mouseenter', updateDisplay, false);
    canvas.addEventListener('mouseleave', resetDisplay, false);    
    canvas.addEventListener('click', captureMouseData, false); 
   
    w_ChangeManager.onmessage = (event) =>
    {
        const keys1 = Object.keys(Scene.SceneDesc);
        const keys2 = Object.keys(event.data);
          
        if (keys1.length !== keys2.length) {
          location.reload();
        }
        for(let key of keys1)
        {
            if(JSON.stringify(Scene.SceneDesc[key].transform) !== JSON.stringify(event.data[key].transform))
            {
                location.reload();
            }

            if(JSON.stringify(Scene.SceneDesc[key].VTX) !== JSON.stringify(event.data[key].VTX))
            {
                location.reload();
            }

            if(JSON.stringify(Scene.SceneDesc[key].IDX) !== JSON.stringify(event.data[key].IDX))
            {
                location.reload();
            }

            if(Scene.SceneDesc[key].material !== event.data[key].material)
            {
                location.reload();
            }
        }
        
    }
    
    w_GameLoopManager.onmessage = (event) =>
    { 
        const gametime = document.getElementById('gametime');
        const frame = document.getElementById('frame');
        const dt = document.getElementById('dt');
        const mfps = document.getElementById('mfps');

        gametime.innerHTML = event.data[0];
        frame.innerHTML = event.data[1];
        mfps.innerHTML = event.data[2];
       
        const x = document.getElementById('nx').textContent;
        const y = document.getElementById('ny').textContent;
       
        const cx = document.getElementById('cx').textContent;
        const cy = document.getElementById('cy').textContent;
        
        const cdt = document.getElementById('clickdt').textContent;
        const frameCount = document.getElementById('frame').textContent;
    
        const px = document.getElementById('x').textContent;
        const py = document.getElementById('y').textContent;

        //Notify MessageManager
        w_MessageManager.postMessage([x, y, cx, cy, cdt, px, py, Scene.GameObjectCollection, render.CameraInfo])
        
        if(event.data[0] != 'command')
        {   
            scene.UpdateTransforms();
            render.RenderFrame(event.data[1], event.data[0], frameCount-cdt, event.data[3], currentActiveObject);
        }

        //Render Scene
        if(event.data[0] == 'command')
        {
            render.UpdateEventInfo(event.data);
        }
    }

    w_MessageManager.onmessage = (event) =>
    {
        if(event.data[0] == 'PRO')
        {
            if(event.data[1] != w_MessageManager.currentProfile)
            {
                w_MessageManager.currentProfile = event.data[1]
                if(event.data[2])
                {
                    render.UpdateProfile([event.data[2]]);
                    for(let obj of Object.entries(event.data[2]))
                    {   
                        const p = obj[1];
                        const v = obj[0].split('_');
                        if(v[0] == 'TOGGLE')
                        {
                            let toggle = document.getElementById(v[1]);
                            if(toggle)
                            {
                                if(toggle.checked != p)
                                {
                                    toggle.click();
                                }
                            }  
                        }
                    }
                }
            }
        }

        if(event.data[0] == 'activeObj')
        {
            currentActiveObject = event;
            const aobj = document.getElementById('activeObject')
            aobj.innerHTML = [event.data[1].name, event.data[1].message, event.data[1].cpos, event.data[1].scpos]
        }
    }
}
APP();

