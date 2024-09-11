import * as fabric from 'fabric';

class FabricHistory {
  private canvas: fabric.Canvas;
  
  skip: boolean = false;
  historyUndo: string[] = [];
  historyRedo: string[] = [];

  listeners: any[] = [];

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    
    this.saveAction();

    this.canvas.on(this.eventsToTrack());

    this.getSnapshot = this.getSnapshot.bind(this);
  }

  dispose() {
    this.canvas.off(this.eventsToTrack());
  }

  eventsToTrack() {
    return {
      'object:modified': () => this.saveAction(),
      'object:added': () => this.saveAction(),
      'object:removed': () => this.saveAction(),
    }
  }

  saveAction() {
    if (this.skip === true) {
      return;
    }
    
    const json = JSON.stringify(this.canvas?.toDatalessJSON(['selectable', 'editable']));

    this.historyUndo.push(json);
    this.historyRedo = [];

    this.updateSnapshot();
    this.emitChange()
  }

  undo() {
    if (this.historyUndo.length === 1) {
      return false;
    }

    this.skip = true;

    const current = this.historyUndo.pop();

    if (current) {
      this.historyRedo.push(current);
    }

    const stateToRender = this.historyUndo.at(-1);

    if (stateToRender) {
      this.canvas.loadFromJSON(stateToRender).then(canvas => {
        this.skip = false
        canvas.renderAll()
      })
    }

    this.updateSnapshot();
    this.emitChange();
  }

  redo() {
    if (this.historyRedo.length === 0) { 
      return false;
    }
    this.skip = true;

    const stateToRender = this.historyRedo.pop() as string;

    this.historyUndo.push(stateToRender);
    
    this.canvas.loadFromJSON(stateToRender).then(canvas => {
        this.skip = false
        canvas.renderAll()
    })

    this.updateSnapshot();
    this.emitChange();
  }

  canUndo() {
    return this.historyUndo.length > 1;
  }

  canRedo() {
    return this.historyRedo.length > 0;
  }

  emitChange() {
    for (let listener of this.listeners) {
      listener();
    }
  }

  subscribe = (listener: any) => {
    this.listeners = [...this.listeners, listener];

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  snapshot = {
    canUndo: false,
    canRedo: false,
  }

  updateSnapshot() {
    this.snapshot = {
      canRedo: this.canRedo(),
      canUndo: this.canUndo(),
    }
  }

  getSnapshot() {
    return this.snapshot;
  }
}

export default FabricHistory
