export interface InputEvent<T> {
  value: T;
  type: string;
  stopPropagation: Function;
  preventDefault: Function;
}

export interface PickerEvent {
  value: number;
}
