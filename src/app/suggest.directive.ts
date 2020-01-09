import { Directive, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const noop = () => {
  // ...
};

@Directive({
  selector: 'input[type=text][ngModel][ngModelSuggestions]',
  inputs: [
    "suggestions: ngModelSuggestions"
  ],
  host: {
    "(blur)": "handleBlur( $event )",
    "(input)": "handleInput( $event )",
    "(keydown)": "handleKeydown( $event )",
    "(mousedown)": "handleMousedown( $event )"
  },
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: SuggestDirective,
        multi: true
    }
]
})
export class SuggestDirective {
  public suggestions: string[];

  private activeSuggestion: string | null;
  private elementRef: ElementRef;
  private onChangeCallback: Function;
  private onTouchedCallback: Function;
  private value: string;

  constructor(elementRef: ElementRef) { 
    this.elementRef = elementRef;
    this.onChangeCallback = noop;
    this.onTouchedCallback = noop;
    this.activeSuggestion = null;
    this.suggestions = [];
    this.value = "";
  }
  public handleBlur( event: Event ) : void {
    this.clearActiveSuggestion();
    this.onTouchedCallback();
  }
  public handleInput( event: KeyboardEvent ) : void {

    const previousValue = this.value;
    const newValue = this.elementRef.nativeElement.value;
    const selectionStart = this.elementRef.nativeElement.selectionStart;
    if ( newValue.startsWith( previousValue ) ) {
        if ( selectionStart === newValue.length ) {
            if ( this.activeSuggestion = this.getFirstMatchingSuggestion( newValue ) ) {
                const suggestionSuffix = this.activeSuggestion.slice( selectionStart );
                this.elementRef.nativeElement.value = ( newValue + suggestionSuffix );
                this.elementRef.nativeElement.selectionStart = selectionStart;
                this.elementRef.nativeElement.selectionEnd = this.activeSuggestion.length;
            }
        }
    }
    this.onChangeCallback( this.value = newValue );
  } 
  public handleKeydown( event: KeyboardEvent ) : void {
    if ( ! this.activeSuggestion ) {
        return;
    }

    if ( this.isAcceptSuggestionEvent( event ) ) {
        event.preventDefault();
        this.value = this.elementRef.nativeElement.value;
        this.elementRef.nativeElement.selectionStart = this.value.length;
        this.elementRef.nativeElement.selectionEnd = this.value.length;
        this.activeSuggestion = null;
        this.onChangeCallback( this.value );
    } else {
        this.clearActiveSuggestion();
    }

  }
  public handleMousedown( event: Event ) : void {
    this.clearActiveSuggestion();
  }
  public registerOnChange( callback: Function ) : void {
    this.onChangeCallback = callback;
  }
  public registerOnTouched( callback: Function ) : void {
    this.onTouchedCallback = callback;
  }
  public setDisabledState( isDisabled: boolean ) : void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }
  public writeValue( value: string ) : void {
    let normalizedValue = ( value || "" );
    if ( this.value !== normalizedValue ) {
        this.value = this.elementRef.nativeElement.value = normalizedValue;
        this.activeSuggestion = null;
    }
  }
  private clearActiveSuggestion() : void {
    if ( this.activeSuggestion ) {
        this.activeSuggestion = null;
        this.elementRef.nativeElement.value = this.value;
    }
  }
  private getFirstMatchingSuggestion( prefix: string ) : string | null {
    let normalizedPrefix = prefix.toLowerCase();
    for ( let suggestion of this.suggestions ) {
        if ( suggestion.length <= normalizedPrefix.length ) {
            continue;
        }
        if ( suggestion.toLowerCase().startsWith( normalizedPrefix ) ) {
            return( suggestion );
        }
    }
    return( null );
  }
  private isAcceptSuggestionEvent( event: KeyboardEvent ) : boolean {
    return(
        ( event.key === "Tab" ) ||
        ( event.key === "ArrowRight" ) || 
        ( event.key === "ArrowDown" )
    );
  }
}
