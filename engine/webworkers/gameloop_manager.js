class GameLoopManager
{
    #FPS = 40;
    #frame = 0;
    FixPoints = {};
    
    IncrementFrame()
    {
        this.#frame++;
    }

    GetFrame()
    {
        return this.#frame;
    }

    GetGameTime()
    {
        return this.#frame / this.#FPS;
    }

    GetFPS()
    {
        return this.#FPS;
    }

    GetDt()
    {
        return 1000.0/this.#FPS;
    }
}

async function InitGameLoopManager()
{
    const glm = new GameLoopManager();
    let dt_fixed = glm.GetDt();

    let frameStart = 0;
    let frameEnd = 0;
    
    let stopEvent = 0;
    let stopFrames = 0;
    let MFPS = 0;
   
    let EVENT_STACK = {};
    self.onmessage = (event) =>
    {
        let name = event.data[0]
        event.data[1].push(glm.GetGameTime())
        if(EVENT_STACK[name] != null)
        {
            if(EVENT_STACK[name].length > 5)
            {
                EVENT_STACK[name] = [EVENT_STACK[4]]
            }
            else
            {
                EVENT_STACK[name].push(event.data[1]) 
            }
        }
        else
        {
            EVENT_STACK[name] = [event.data[1]];
        }
        event.data[1].push(EVENT_STACK[name].length & 1)
        self.postMessage(['command', event.data[1]])  
    }
   
    while(true)
    { 
      
        frameStart = Date.now();
        glm.IncrementFrame();
       
        let df = glm.GetFrame() - stopFrames;
        console.log(df)
        
        if(df > 60)
        {
            MFPS = 1000.0*df / (Date.now() - stopEvent);

            stopEvent = Date.now();
            stopFrames = glm.GetFrame(); 
        }
       
        self.postMessage([glm.GetGameTime(), glm.GetFrame(), MFPS]);
        frameEnd = Date.now();
        
        const measureDt = frameEnd - frameStart; 
        if(measureDt < dt_fixed)
        { 
            await new Promise(r => setTimeout(r, (dt_fixed - measureDt)));
        }
    }
}
InitGameLoopManager();


