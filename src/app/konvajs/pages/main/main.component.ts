import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import Konva from 'konva';
import { Image as KonvaImage } from 'konva/lib/shapes/Image';
import { Text } from 'konva/lib/shapes/Text';
//import { CanvasService } from '../../../../../services/canvas/canvas.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements  AfterViewInit{

  @ViewChild('canvasContent') canvasContent!: ElementRef;
  @ViewChild('stageContainer') stageContainer!: ElementRef;

  loading = false;

  stage!: Konva.Stage;
  layer!: Konva.Layer;
  trText!: Konva.Transformer;
  private scale = 1;

  nodos: any;

  private _currentNodeText = {
    id: 0,
    fontSize: 30,
    color: '#000000',
    align: 'left',
    style: 'normal',
    fontFamily: 'Montserrat'
  };

  get currentNodeText() {
    return this._currentNodeText;
  }

  set currentNodeText(value) {
    this._currentNodeText = value;
  }

  assetUrl: string = '';

  fontsList = [
    'Montserrat', 
    'Bebas Neue',
    'Caveat',
    'Cormorant Garamond',
    'Dancing Script',
    'Indie Flower',
    'Raleway',
    'Secular One',
    'Splash',
    'Yellowtail'
  ];

  textFeatures = false;
  imgFeatures = false;

  showFontOptions = false;

  showSecondSidebar = false;

  featuresSecondSidebar = 'layersList';

  assetsTemplates:any;

  currentNodeImg = {
    id: 0
  }

  constructor(private router: Router){ //private canvasSv: CanvasService

    this.assetUrl = localStorage.getItem('assetSelected') || '';

  }

  ngAfterViewInit() {

    const container = this.stageContainer.nativeElement;

    this.stage = new Konva.Stage({
      container,
      width: 1,
      height: 1,
      // draggable: true,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.trText = new Konva.Transformer({
      keepRatio: false,
      padding: 5,
      enabledAnchors: ['top-left', 'top-right', 'middle-right', 'bottom-left', 'bottom-right'],
      name: 'transformer',
      // limit transformer size
      boundBoxFunc: (oldBox, newBox) => {
        if (newBox.width < 100 || newBox.height < 20) {
          return oldBox;
        }
        return newBox;
      },
    });

    Konva.Image.fromURL(this.assetUrl, (image:KonvaImage) => {

      const originalWidth  = image.width();
      const originalHeight = image.height();

      const stage = this.setStageDimensions(originalWidth, originalHeight);

      this.stage.width(stage.w);
      this.stage.height(stage.h);

      image.width(stage.w);
      image.height(stage.h);
      image.name('imageCover');
      
      this.layer.add(image);
      this.layer.draw();

    });

    //* Eliminar nodos para transformar al dar clic en el stage
    this.stage.on('click tap', (e) => {

      if (e.target.hasName('imageCover')) {
        this.trText.nodes([]);
        this.textFeatures = false;
        this.imgFeatures = false;
        this.showFontOptions = false;
        this.showSecondSidebar = false;
        return;
      }

    });
  }

  setStageDimensions(widthImg: number, heightImg:number){

    const canvasContentWidth = this.canvasContent.nativeElement.offsetWidth;
    const canvasContentHeight = this.canvasContent.nativeElement.offsetHeight;

    let stageDimensions = {
      w: 0,
      h: 0,
    };

    if((canvasContentHeight * 0.90 / heightImg * widthImg) > canvasContentWidth){

      stageDimensions.w = canvasContentWidth;
      stageDimensions.h = (stageDimensions.w / widthImg * heightImg);
      
    }else{

      stageDimensions.h =  canvasContentHeight * 0.90;
      stageDimensions.w = (stageDimensions.h  / heightImg * widthImg);

    }

    return stageDimensions;

  }

  leaveCanvasEditor(){

    this.router.navigateByUrl('/social-media/gallery');

  }

  zoomIn(){
    const oldScale = this.scale;
    const pointer = this.stage.getPointerPosition()!;

    this.scale *= 1.1;

    this.layer.scale({ x: this.scale, y: this.scale });

    const newPos = {
      x: pointer.x - (pointer.x - this.layer.x()) * this.scale / oldScale,
      y: pointer.y - (pointer.y - this.layer.y()) * this.scale / oldScale,
    };

    this.layer.position(newPos);
    this.stage.batchDraw();
    
  }
  
  zoomOut(){
    const oldScale = this.scale;
    const pointer = this.stage.getPointerPosition()!;

    this.scale /= 1.1;

    this.layer.scale({ x: this.scale, y: this.scale });

    const newPos = {
      x: pointer.x - (pointer.x - this.layer.x()) * this.scale / oldScale,
      y: pointer.y - (pointer.y - this.layer.y()) * this.scale / oldScale,
    };

    this.layer.position(newPos);
    this.stage.batchDraw();
  }

  insertNewText(){

    this.imgFeatures = false;

    const self = this;
    const textNode = new Konva.Text({
      text: 'Escribe aquí',
      x: this.stage.width()/3,
      y: 100,
      fill: '#00000',
      fontSize: 30,
      fontFamily:'Montserrat',
      fontStyle: 'normal',
      draggable: true,
    });

    this.currentNodeText = {
      id: textNode._id,
      fontSize: textNode.fontSize(),
      color: textNode.fill(),
      align: textNode.align(),
      style: textNode.fontStyle(),
      fontFamily: textNode.fontFamily()
    }

    this.layer.add(textNode);
    this.transformText(textNode);

    //* Escuchar edición
    textNode.on('click tap', function(e) {
      self.transformText(this);
    });

    //* Transforma texto
    textNode.on('transform', () => {

      const newHeight   = Math.round(textNode.height() * textNode.scaleY());
      const newWidth    = Math.max(textNode.width() * textNode.scaleX(), 100);
      const newFontSize = newHeight != Math.round(textNode.height()) 
                          ? textNode.fontSize() * textNode.scaleX()
                          : textNode.fontSize();

      this.currentNodeText.fontSize = Math.round(newFontSize);
                          
      textNode.setAttrs({
        width: newWidth,
        scaleX: 1,
        scaleY: 1,
        fontSize: newFontSize
      });

    });

    //* Editar texto
    textNode.on('dblclick dbltap', () => {
      // hide text node and transformer:
      textNode.hide();
      self.trText.hide();
  
      // create textarea over canvas with absolute position
      // first we need to find position for textarea
      // how to find it?
  
      // at first lets find position of text node relative to the stage:
      let textPosition = textNode.absolutePosition();
  
      // so position of textarea will be the sum of positions above:
      let areaPosition = {
        x: this.stage.container().offsetLeft + textPosition.x,
        y: this.stage.container().offsetTop + textPosition.y,
      };
  
      // create textarea and style it
      let textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
  
      // apply many styles to match text on canvas as close as possible
      // remember that text rendering on canvas and on the textarea can be different
      // and sometimes it is hard to make it 100% the same. But we will try...
      textarea.value = textNode.text();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
      textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
      textarea.style.fontSize = textNode.fontSize() + 'px';
      textarea.style.border = 'none';
      textarea.style.padding = '0px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.background = 'none';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.lineHeight = `${textNode.lineHeight()}`;
      textarea.style.fontFamily = textNode.fontFamily();
      textarea.style.transformOrigin = 'left top';
      textarea.style.textAlign = textNode.align();
      textarea.style.color = textNode.fill();
      let rotation = textNode.rotation();
      let transform = '';
      if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
      }
  
      let px = 0;
      // also we need to slightly move textarea on firefox
      // because it jumps a bit
      let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
      }
      transform += 'translateY(-' + px + 'px)';
  
      textarea.style.transform = transform;
  
      // reset height
      textarea.style.height = 'auto';
      // after browsers resized it we can set actual value
      textarea.style.height = textarea.scrollHeight + 3 + 'px';
  
      textarea.focus();
  
      function removeTextarea() {
        textarea.parentNode?.removeChild(textarea);
        window.removeEventListener('click', handleOutsideClick);
        textNode.show();
        self.trText.show();
        self.trText.forceUpdate();
      }
  
      function setTextareaWidth(newWidth :any) {
        if (!newWidth) {
          // set width for placeholder
          //newWidth = textNode .placeholder.length * textNode.fontSize();
        }
        // some extra fixes on different browsers
        let isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        let isFirefox =
          navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isSafari || isFirefox) {
          newWidth = Math.ceil(newWidth);
        }
  
        // let isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
        // if (isEdge) {
        //   newWidth += 1;
        // }
        textarea.style.width = newWidth + 'px';
      }
  
      textarea.addEventListener('keydown', function (e) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.keyCode === 13 && !e.shiftKey) {
          textNode.text(textarea.value);
          removeTextarea();
        }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
          removeTextarea();
        }
      });
  
      textarea.addEventListener('keydown', function (e) {
        let scale = textNode.getAbsoluteScale().x;
        setTextareaWidth(textNode.width() * scale);
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + textNode.fontSize() + 'px';
      });
  
      function handleOutsideClick(e:any) {
        if (e.target !== textarea) {
          textNode.text(textarea.value);
          removeTextarea();
        }
      }
  
      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
      });
  
    });

  }

  transformText(textNode:Text){

    this.textFeatures = true;
    this.showSecondSidebar = false;
    this.currentNodeText = {
      id: textNode._id,
      fontSize: Math.round(textNode.fontSize()),
      color: textNode.fill(),
      align: textNode.align(),
      style: textNode.fontStyle(),
      fontFamily: textNode.fontFamily()
    }
    this.trText.nodes([textNode]);
    this.layer.add(this.trText);
  }

  deleteText(){
    
    const currentNode = this.layer.children?.find(node => node._id == this.currentNodeText.id);
    currentNode?.remove();
    this.trText.nodes([]);
    this.textFeatures = false;
    this.stage.draw();

  }
  
  fontOptions(){
    this.showFontOptions = !this.showFontOptions;
  }

  setFontFamily(fontFamily: string){

    this.showFontOptions = false;
    const currentNode = this.layer.children?.find(node => node._id == this.currentNodeText.id);
    currentNode?.setAttrs({
      fontFamily: fontFamily
    });

    this.currentNodeText.fontFamily = fontFamily;
  }

  changeTextColor(){

    const currentNode = this.layer.children?.find(node => node._id == this.currentNodeText.id);
    currentNode?.setAttrs({
      fill: this.currentNodeText.color
    });

  }

  addBackground(){
    console.log('Add background');
  }

  updateFontSize(){

    const currentNode = this.layer.children?.find(node => node._id == this.currentNodeText.id);
    currentNode?.setAttrs({
      fontSize: this.currentNodeText.fontSize
    });
    
  }
  
  setTextBold(){

    const currentNode = this.layer.children?.find(node => node._id == this.currentNodeText.id);
    const activeBold = currentNode?.attrs.fontStyle !== 'bold' ? true : false;

    currentNode?.setAttrs({
      fontStyle: activeBold ? 'bold' : 'normal'
    });

  }

  setTextAlign(textDecoration:string){

    const currentNode = this.layer.children?.find(node => node._id == this.currentNodeText.id);
    currentNode?.setAttrs({
      align: textDecoration
    });
    
  }

  handleImageChange(event: any) {

    const self = this;
    const file = event.target.files[0];

    if(!file){ return; }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {

      const image = new Image();
      image.src = reader.result as string;

      image.onload = () => {

        const maxWidth = this.stage.width() * 0.3;
        const konvaImage = new Konva.Image({
          image,
          x: maxWidth,
          y: 100,
          width: maxWidth, 
          height: (maxWidth / image.width * image.height), 
          draggable: true,
          name: file.name
        });

        self.currentNodeImg.id = konvaImage._id;

        //* Escuchar edición
        konvaImage.on('click tap', function(e) {
          self.transformImg(this);
        });
  
        this.layer.add(konvaImage);
        this.transformImg(konvaImage);
      };

    };

  }

  transformImg(imageNode: KonvaImage){

    this.textFeatures = false;
    this.showSecondSidebar = false;
    this.imgFeatures  = true;
    this.currentNodeImg.id = imageNode._id;
    this.trText.nodes([imageNode]);
    this.layer.add(this.trText);

  }

  deleteImg(){

    const currentNode = this.layer.children?.find(node => node._id == this.currentNodeImg.id);
    currentNode?.remove();
    this.trText.nodes([]);
    this.imgFeatures = false;
    this.stage.draw();

  }

  showLayers(){

    this.featuresSecondSidebar = 'layersList';
    this.nodos = this.layer.children?.filter(child => { return child.name() != 'imageCover' && child.name() != 'transformer'});

    if(this.nodos.length > 0){

      this.showSecondSidebar = !this.showSecondSidebar;

    }else{
      this.showSecondSidebar = false;
    }
  }

  selectNode(nodo:any){

    if(nodo.className == 'Text'){
      
      this.transformText(nodo);
      
    }else if(nodo.className == 'Image'){
      
      this.transformImg(nodo);

    }

  }

  deleteNode(nodo:any){

    if(nodo.className == 'Text'){
      
      this.transformText(nodo);
      this.deleteText();
      
    }else if(nodo.className == 'Image'){
      
      this.transformImg(nodo);
      this.deleteImg();

    }
  }

  chagePosition(nodo:any, typePosition:string){
    console.log('change Position');

    console.log(this.layer.children);
    //nodo.moveUp();
    console.log(this.layer.children);
    
    nodo.moveDown();

  }

  getAssets(folder:string, showSidebar:boolean){

    this.loading = true;

    if(showSidebar){
      
      this.showSecondSidebar = !this.showSecondSidebar;
      this.featuresSecondSidebar = 'assetsList';

    }

    if(this.showSecondSidebar){

      this.assetsTemplates = [];
  
      this.loading = false;
      this.assetsTemplates = 'https://fastly.picsum.photos/id/88/200/300.jpg?hmac=JmiMN7iyW4Saka82S4HzDvbOjMSB2k9NwTN29MHWqa4';

      //this.canvasSv.retrieveTemplates([folder]).subscribe(assets => {});
    }
  }

  addAsset(assetUrl:string, index:number){

    const self = this;

    this.showSecondSidebar = false;

    Konva.Image.fromURL(assetUrl, (image:KonvaImage) => {

      const originalWidth  = image.width();
      const originalHeight = image.height();

      const maxWidth = this.stage.width() * 0.2;

      image.width(this.stage.width() * 0.2);
      image.height(maxWidth / originalWidth * originalHeight);
      image.x(maxWidth),
      image.y(100),
      image.draggable(true);
      image.name(`Text ${index + 1}`);

      this.layer.add(image);
      this.transformImg(image);
      this.layer.draw();

      image.on('click tap', function(e) {
        self.transformImg(this);
      });

    });


  }

  downloadStage(){
    const dataURL = this.stage.toDataURL();
    const link = document.createElement('a');
    link.download = 'stage.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  @HostListener('window:resize')
  onWindowResize() {
    const container = this.stageContainer.nativeElement;
    
    // Actualizamos el ancho y alto del Stage en función del tamaño de la ventana
    this.stage.width(container.offsetWidth);
    this.stage.height(container.offsetHeight);
  }
}
