import { AfterViewInit, Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasRef', { static: false}) canvasRef: ElementRef | undefined;

  public width = 800;
  public height = 450;

  private isAvaible: boolean = false;

  private ctx!: CanvasRenderingContext2D;

  private points: Array<any> = [];

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (e: any) => {
    if(e.target.id === 'canvasId' && this.isAvaible){
      this.write(e);
    } 
  }

  @HostListener('click', ['$event'])
  onMouseClick = (e: any) => {
    if(e.target.id === 'canvasId'){
      this.isAvaible = !this.isAvaible;
    }
  }

  constructor(private socketSv: SocketService){}

  ngOnInit(): void {

    this.socketSv.getCoords().subscribe(coords => {

      //console.log(coords);
      this.writeSingle(coords, false);
      
    });
    
  }

  ngAfterViewInit(): void {
    this.render();
  }

  private render():any{

    const canvasEl = this.canvasRef?.nativeElement;

    this.ctx = canvasEl.getContext('2d');
    
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = "#00000";

  }

  private write(res: any):any{

    const canvasEl = this.canvasRef?.nativeElement;
    const rect = canvasEl.getBoundingClientRect();

    const prevPos = {
      x: res.clientX - rect.left,
      y: res.clientY - rect.top,
    }

    this.writeSingle(prevPos);
  }

  private writeSingle(prevPos: any, emit=true){

    this.points.push(prevPos);

    if(this.points.length > 3){
      const prevPos = this.points[this.points.length - 1];
      const currentPos = this.points[this.points.length - 2];

      this.drawOnCanvas(prevPos, currentPos);

      if(emit){
        this.socketSv.sendCoords(prevPos);
      }
    }

  }

  private drawOnCanvas(prevPos:any, currentPos: any){

    if(!this.ctx) return;

    this.ctx.beginPath();

    if(prevPos){
      this.ctx.moveTo(prevPos.x, prevPos.y);
      this.ctx.lineTo(currentPos.x, currentPos.y);
      this.ctx.stroke();
    }

  }

  public clearZone(){

    this.points = [];
    this.ctx.clearRect(0,0, this.width, this.height);

  }

}
