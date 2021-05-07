import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';
import P5 from 'p5';

const srandom = seedrandom('b');

export default class P5Renderer implements BaseRenderer{

    recording: boolean = false;
    colors = ['#0B688C', '#1EC6D9', '#30F2DF', '#F2B3B3'];
    backgroundColor = '#ffffff';

    canvas: HTMLCanvasElement;
    s: any;

    completeCallback: any;
    delta = 0;
    animating = true;

    width: number = 1920 / 2;
    height: number = 1080 / 2;

    size: number;

    x: number;
    y: number;

    frameCount = 0;
    totalFrames = 1000;

    constructor(w, h) {

        this.width = w;
        this.height = h;

        const sketch = (s) => {
            this.s = s;
            s.pixelDensity(1);
            s.setup = () => this.setup(s)
            s.draw = () => this.draw(s)
        }

        new P5(sketch);
    }

    protected setup(s) {
        let renderer = s.createCanvas(this.width, this.height);
        this.canvas = renderer.canvas;

        s.noiseSeed(99);
        let bg = s.color(this.backgroundColor);
        s.background(bg);
        s.rectMode(s.CENTER);

        //s.colorMode(s.HSB);
    }

    protected draw(s) {
        if (this.animating) { 
            this.frameCount += 5;

            let frameDelta = 2 * Math.PI * (this.frameCount % this.totalFrames) / this.totalFrames;

            let size = 5;
            let space = 3;
            let count = 700;
            let r, 
            x1, 
            y1, 
            golden = s.radians(180*(3-s.sqrt(5)));

            s.background(this.backgroundColor);
            s.smooth();
            s.noStroke();
            s.fill(this.colors[0]);

            for (let n=1; n<=count; n++) 
            {
              r = space*s.sqrt(n) + Math.sin(frameDelta) * 2;
              x1 = s.width/2+2*r*s.cos(golden*n);
              y1 = s.height/2+2*r*s.sin(golden*n);
              //x1 += Math.sin(n + frameDelta + golden) * 2;
              //y1 += Math.cos(n + frameDelta + golden) * 2;

              let scale = Math.sin(n + frameDelta) * size;
              s.ellipse(x1, y1, scale, scale);
            }
            
            if (this.recording) {
                if (frameDelta == 0) {
                    this.completeCallback();
                }
            }
        }
    }

    protected getPolar = function(x, y, r, a) {
        // Get as radians
        var fa = a * (Math.PI / 180);
        
        // Convert coordinates
        var dx = r * Math.cos(fa);
        var dy = r * Math.sin(fa);
        
        // Add origin values (not necessary)
        var fx = x + dx;
        var fy = y + dy;
    
        return [fx, fy];
    }
    

    public render() {

    }

    public play() {
        this.frameCount = 0;
        this.recording = true;
        this.animating = true;
        let bg = this.s.color(this.backgroundColor);
        this.s.background(bg);
    }

    public stop() {
        this.animating = false;
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    public resize() {
        this.s.resizeCanvas(window.innerWidth, window.innerHeight);
        this.s.background(0, 0, 0, 255);
    }
}