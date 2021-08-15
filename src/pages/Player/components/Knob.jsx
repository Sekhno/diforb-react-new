import React, { createRef, useEffect } from 'react'
import './knob.scss'


/**
 * @ReactComponent 
 * @param {*} props
 * @param {Function} props.onChange
 */
const Knob = props => {
    const tensionKnob = createRef()

    useEffect(() => {
        var knobInput = new KnobInput(tensionKnob.current, {
            visualContext: function() {
                this.indicatorRing = this.element.querySelector('.indicator-ring');
                var ringStyle = getComputedStyle(this.element.querySelector('.indicator-ring-bg'));
                this.r = parseFloat(ringStyle.r) - (parseFloat(ringStyle.strokeWidth) / 2);
            },
            updateVisuals: function(norm) {
                var theta = Math.PI*2*norm + 0.5*Math.PI;
                var endX = this.r*Math.cos(theta) + 20;
                var endY = this.r*Math.sin(theta) + 20;
                this.indicatorRing.setAttribute('d',`M20,20l0,-${this.r}A${this.r},${this.r},0,0,${norm<0.5?0:1},${endX},${endY}Z`);
                if (knobInput && knobInput.value !== undefined) {
                    props.onChange(knobInput.value)
                }
            },
            min: -100,
            max: 100,
            initial: 0,
        })
    },[tensionKnob])

    return (
        <div 
            className = 'knob-input fl-studio-envelope__knob tension-knob release'
            ref = { tensionKnob }
        >
            <svg className = 'knob-input__visual' viewBox='0 0 40 40'>
                <defs>
                    <radialGradient id='grad-dial-soft-shadow' cx='0.5' cy='0.5' r='0.5'>
                        <stop offset='85%' stopColor='#242a2e' stopOpacity='0.1'></stop>
                        <stop offset='100%' stopColor='#242a2e' stopOpacity='0'></stop>
                    </radialGradient>
                    <linearGradient id='grad-dial-base' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor='#f5f5f5'></stop>
                        <stop offset='100%' stopColor='#ccc'></stop>
                    </linearGradient>
                    <linearGradient id='grad-dial-highlight' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor='#70777d' stopOpacity='.2'></stop>
                        <stop offset='40%' stopColor='#70777d' stopOpacity='0'></stop>
                        <stop offset='55%' stopColor='#70777d' stopOpacity='0'></stop>
                        <stop offset='100%' stopColor='#70777d' stopOpacity='0.1'></stop>
                    </linearGradient>
                </defs>
                <circle className = 'focus-indicator' cx='20' cy='20' r='18' fill='#4eccff' filter='url(#glow)'></circle>
                <circle className = 'indicator-ring-bg' cx='20' cy='20' r='18' fill='#353b3f' stroke='#23292d' opacity='0'></circle>
                <path className = 'indicator-ring' d='M20,20Z' fill='#5EC7E1'></path>
                <g className = 'dial'>
                    <circle cx='20' cy='20' r='16' fill='url(#grad-dial-soft-shadow)'></circle>
                    {/* <ellipse cx='20' cy='22' rx='14' ry='14.5' fill='#242a2e' opacity='0.15'></ellipse> */}
                    <circle cx='20' cy='20' r='14' fill='url(#grad-dial-base)'></circle>
                    <circle cx='20' cy='20' r='13' fill='transparent' stroke='url(#grad-dial-highlight)' strokeWidth='1.5'></circle>
                    <circle className = 'dial-highlight' cx='20' cy='20' r='14' fill='#ffffff'></circle>
                </g>
                <path transform="scale(0.63)" fill="#999999" d="M6.697,45.921c0.062,0.121,0.17,0.211,0.299,0.251c0.048,0.015,0.097,0.021,0.146,0.021
                    c0.084,0,0.167-0.021,0.242-0.062l1.442-0.797c0.242-0.133,0.33-0.438,0.196-0.679l-0.13-0.24
                    c-0.134-0.236-0.433-0.32-0.672-0.194l-1.448,0.781c-0.119,0.064-0.207,0.174-0.243,0.303c-0.037,0.13-0.021,0.269,0.046,0.386
                    C6.619,45.767,6.658,45.844,6.697,45.921z M5.753,34.628c0.085-0.104,0.125-0.237,0.111-0.371L5.84,34.011
                    c-0.01-0.133-0.072-0.256-0.172-0.343c-0.101-0.087-0.232-0.13-0.365-0.119L3.66,33.676c-0.133,0.01-0.253,0.117-0.339,0.22
                    c-0.086,0.102-0.125,0.278-0.112,0.411l0.013,0.172c0.007,0.135,0.069,0.262,0.171,0.351c0.091,0.08,0.208,0.123,0.328,0.123
                    c0.014,0,0.028-0.001,0.043-0.002l1.646-0.142C5.543,34.797,5.667,34.732,5.753,34.628z M11.6,12.096
                    c-0.2-0.187-0.549-0.141-0.736,0.057c-0.062,0.065-0.125,0.131-0.183,0.203c-0.167,0.206-0.144,0.506,0.052,0.684l1.219,1.11
                    c0.089,0.081,0.218,0.111,0.34,0.111c0.014,0,0.028,0,0.042-0.001c0.134-0.008,0.276-0.088,0.365-0.188l0.135-0.151
                    c0.185-0.203,0.171-0.517-0.029-0.703L11.6,12.096z M11.885,48.99c-0.175-0.204-0.482-0.23-0.69-0.063l-4.438,3.556
                    c-0.106,0.085-0.173,0.21-0.186,0.346c-0.012,0.135,0.031,0.27,0.12,0.372l0.181,0.209c0.099,0.114,0.238,0.173,0.378,0.173
                    c0.11,0,0.221-0.036,0.313-0.11l4.433-3.562c0.106-0.085,0.173-0.209,0.185-0.345c0.012-0.135-0.031-0.27-0.12-0.372L11.885,48.99
                    z M3.749,29.047l1.637,0.195c0.02,0.003,0.04,0.004,0.059,0.004c0.112,0,0.221-0.037,0.31-0.107
                    c0.104-0.082,0.171-0.202,0.187-0.334l0.031-0.264c0.032-0.272-0.161-0.52-0.433-0.555l-1.633-0.21
                    c-0.134-0.018-0.265,0.019-0.37,0.101c-0.105,0.082-0.174,0.202-0.19,0.334l-0.035,0.278c-0.017,0.132,0.021,0.265,0.103,0.37
                    C3.497,28.964,3.617,29.031,3.749,29.047z M57.17,23.287l0.084,0.249c0.07,0.208,0.265,0.34,0.474,0.34
                    c0.053,0,0.106-0.008,0.159-0.025l1.562-0.522c0.126-0.043,0.22-0.166,0.278-0.285c0.059-0.12,0.057-0.29,0.014-0.416
                    l-0.076-0.217c-0.096-0.255-0.377-0.389-0.634-0.297l-1.552,0.542C57.221,22.745,57.082,23.027,57.17,23.287z M16.109,8.285
                    c-0.077-0.108-0.194-0.182-0.326-0.204c-0.131-0.022-0.266,0.009-0.374,0.087L15.183,8.33c-0.108,0.077-0.181,0.194-0.202,0.326
                    c-0.021,0.131,0.011,0.266,0.088,0.373l0.966,1.337c0.098,0.135,0.25,0.207,0.406,0.207c0.101,0,0.202-0.03,0.29-0.093
                    l0.213-0.152c0.224-0.16,0.277-0.472,0.118-0.696L16.109,8.285z M4.943,23.265l1.559,0.525c0.053,0.018,0.107,0.026,0.16,0.026
                    c0.208,0,0.402-0.131,0.473-0.339l0.086-0.252c0.089-0.26-0.049-0.543-0.309-0.633L5.357,22.05
                    c-0.125-0.046-0.265-0.035-0.385,0.023c-0.12,0.059-0.212,0.164-0.254,0.291l-0.089,0.27C4.542,22.895,4.683,23.177,4.943,23.265z
                    M58.404,28.599l0.029,0.268c0.016,0.132,0.082,0.252,0.187,0.335c0.089,0.07,0.198,0.108,0.312,0.108
                    c0.019,0,0.038-0.001,0.057-0.003l1.639-0.19c0.133-0.016,0.253-0.083,0.336-0.188c0.082-0.104,0.119-0.237,0.104-0.369
                    l-0.033-0.28c-0.017-0.132-0.084-0.252-0.189-0.334c-0.104-0.082-0.237-0.122-0.369-0.103l-1.635,0.203
                    C58.567,28.079,58.373,28.326,58.404,28.599z M7.305,17.848l1.418,0.837c0.08,0.047,0.167,0.069,0.254,0.069
                    c0.168,0,0.332-0.085,0.426-0.237l0.138-0.226c0.071-0.114,0.094-0.252,0.062-0.382c-0.031-0.131-0.114-0.243-0.229-0.312
                    l-1.414-0.85c-0.235-0.138-0.54-0.065-0.684,0.167c-0.053,0.085-0.106,0.173-0.154,0.258C6.99,17.409,7.071,17.709,7.305,17.848z
                    M54.996,18.57c0.094,0.156,0.26,0.243,0.43,0.243c0.086,0,0.174-0.022,0.254-0.069l1.422-0.836
                    c0.115-0.067,0.199-0.179,0.231-0.309s0.012-0.268-0.058-0.382l-0.145-0.238c-0.143-0.233-0.449-0.309-0.684-0.17l-1.415,0.845
                    c-0.114,0.068-0.196,0.179-0.229,0.308s-0.013,0.265,0.056,0.379L54.996,18.57z M6.902,39.627l-0.075-0.253
                    c-0.079-0.264-0.357-0.415-0.621-0.337l-1.58,0.465c-0.264,0.077-0.416,0.354-0.339,0.619l0.078,0.269
                    c0.037,0.128,0.125,0.236,0.242,0.3c0.074,0.04,0.155,0.061,0.238,0.061c0.049,0,0.098-0.007,0.146-0.021l1.577-0.48
                    C6.831,40.168,6.98,39.891,6.902,39.627z M52.467,14.199l1.221-1.108c0.1-0.09,0.138-0.238,0.143-0.373
                    c0.006-0.134-0.064-0.286-0.156-0.384c-0.043-0.045-0.086-0.09-0.125-0.138c-0.087-0.107-0.215-0.174-0.353-0.184
                    c-0.134-0.008-0.273,0.038-0.375,0.132l-1.21,1.12c-0.202,0.188-0.215,0.504-0.027,0.706l0.184,0.202
                    c0.098,0.104,0.23,0.156,0.363,0.156C52.25,14.329,52.371,14.286,52.467,14.199z M57.564,45.067l-1.451-0.786
                    c-0.117-0.063-0.254-0.078-0.382-0.04c-0.127,0.038-0.233,0.125-0.297,0.242l-0.126,0.234c-0.131,0.241-0.043,0.541,0.197,0.675
                    l1.442,0.802c0.075,0.041,0.159,0.062,0.243,0.062c0.047,0,0.094-0.007,0.141-0.021c0.127-0.037,0.235-0.125,0.299-0.242
                    l0.135-0.25C57.896,45.501,57.807,45.198,57.564,45.067z M53.045,48.927c-0.209-0.167-0.515-0.141-0.689,0.063l-0.176,0.203
                    c-0.09,0.103-0.133,0.237-0.121,0.372c0.013,0.136,0.08,0.26,0.186,0.345l4.434,3.562c0.092,0.074,0.202,0.11,0.312,0.11
                    c0.141,0,0.279-0.059,0.378-0.173l0.181-0.209c0.09-0.103,0.133-0.237,0.121-0.372c-0.013-0.136-0.08-0.261-0.186-0.346
                    L53.045,48.927z M61.047,33.92c-0.086-0.102-0.208-0.165-0.34-0.176l-1.643-0.135c-0.133-0.011-0.264,0.031-0.365,0.117
                    s-0.164,0.208-0.175,0.34c-0.007,0.081-0.013,0.161-0.023,0.238c-0.019,0.135,0.02,0.271,0.104,0.379
                    c0.085,0.106,0.209,0.174,0.346,0.187l1.646,0.15c0.015,0.001,0.03,0.002,0.046,0.002c0.117,0,0.232-0.042,0.322-0.118
                    c0.103-0.087,0.166-0.211,0.176-0.345l0.023-0.274C61.176,34.152,61.133,34.021,61.047,33.92z M59.727,39.569l-1.58-0.469
                    c-0.266-0.075-0.543,0.071-0.621,0.336l-0.078,0.258c-0.078,0.264,0.07,0.541,0.333,0.622l1.577,0.482
                    c0.048,0.015,0.098,0.021,0.146,0.021c0.082,0,0.164-0.021,0.236-0.06c0.118-0.063,0.205-0.171,0.243-0.299l0.08-0.271
                    C60.142,39.926,59.99,39.647,59.727,39.569z M49.014,8.209c-0.108-0.077-0.242-0.109-0.373-0.086
                    c-0.131,0.022-0.247,0.095-0.324,0.203l-0.955,1.343c-0.16,0.225-0.108,0.535,0.115,0.695l0.217,0.156
                    c0.088,0.064,0.19,0.095,0.291,0.095c0.155,0,0.309-0.071,0.406-0.207l0.967-1.336c0.078-0.107,0.111-0.242,0.09-0.374
                    c-0.022-0.132-0.096-0.249-0.204-0.326L49.014,8.209z M32.517,2.582h-0.338c-0.133,0-0.26,0.053-0.354,0.147
                    c-0.094,0.094-0.146,0.222-0.146,0.354l0.007,1.908c0.001,0.275,0.225,0.498,0.5,0.498h0.331c0.276,0,0.5-0.224,0.5-0.5l0-1.908
                    c0-0.133-0.053-0.26-0.146-0.354S32.65,2.582,32.517,2.582z M26.972,3.812c-0.027-0.13-0.104-0.244-0.215-0.317
                    c-0.111-0.072-0.246-0.097-0.377-0.071l-0.273,0.058c-0.13,0.027-0.244,0.105-0.316,0.217c-0.073,0.111-0.098,0.246-0.07,0.376
                    l0.343,1.612c0.028,0.13,0.106,0.243,0.217,0.315c0.082,0.054,0.177,0.081,0.272,0.081c0.035,0,0.069-0.004,0.104-0.011
                    l0.262-0.056c0.269-0.058,0.441-0.32,0.386-0.59L26.972,3.812z M21.31,5.483c-0.108-0.249-0.402-0.367-0.654-0.263
                    c-0.098,0.041-0.194,0.08-0.288,0.127c-0.239,0.12-0.342,0.406-0.233,0.651l0.67,1.503c0.083,0.186,0.265,0.296,0.457,0.296
                    c0.065,0,0.13-0.013,0.193-0.039c0.085-0.035,0.172-0.074,0.257-0.114c0.245-0.114,0.355-0.402,0.248-0.651L21.31,5.483z
                    M38.324,3.493l-0.275-0.055c-0.27-0.057-0.532,0.12-0.587,0.39l-0.33,1.612c-0.055,0.268,0.114,0.529,0.38,0.589l0.258,0.058
                    c0.036,0.008,0.072,0.012,0.109,0.012c0.095,0,0.188-0.027,0.27-0.079c0.112-0.071,0.191-0.186,0.219-0.315l0.348-1.615
                    c0.028-0.131,0.002-0.268-0.07-0.38C38.57,3.597,38.455,3.52,38.324,3.493z M44.035,5.359l-0.259-0.111
                    c-0.25-0.108-0.544,0.009-0.654,0.261l-0.659,1.513c-0.053,0.124-0.055,0.264-0.004,0.39c0.052,0.125,0.152,0.224,0.277,0.273
                    l0.141,0.061c0.002,0.001,0.092,0.041,0.094,0.041c0.064,0.028,0.131,0.041,0.197,0.041c0.19,0,0.373-0.109,0.456-0.295
                    l0.678-1.505c0.056-0.123,0.059-0.265,0.009-0.39C44.26,5.512,44.161,5.411,44.035,5.359z"/>
            </svg>
        </div>
        
    )
}

export default Knob

/**
 * @class KnobInput
 * @constructor
 * @param {HTMLElement} containerElement
 * @param {object} options     
 */
class KnobInput {
    constructor(containerElement, options) {
        if (!options) {
            options = {};
        }
      
        // settings
        var step = options.step || 'any';
        var min = typeof options.min === 'number' ? options.min : 0;
        var max = typeof options.max === 'number' ? options.max : 1;
        this.initial = typeof options.initial === 'number' ? options.initial : 0.5 * (min + max);
        this.visualElementClass = options.visualElementClass || 'knob-input__visual';
        this.dragResistance = typeof options.dragResistance === 'number' ? options.dragResistance : 300;
        this.dragResistance /= max-min;
        this.wheelResistance = typeof options.wheelResistance === 'number' ? options.wheelResistance : 4000;
        this.wheelResistance /= max-min;
        this.setupVisualContext = typeof options.visualContext === 'function' ? options.visualContext : KnobInput.setupRotationContext(0, 360);
        this.updateVisuals = typeof options.updateVisuals === 'function' ? options.updateVisuals : KnobInput.rotationUpdateFunction;
        
        // setup input
        var rangeInput = document.createElement('input');
        rangeInput.type = 'range';
        rangeInput.step = step;
        rangeInput.min = min;
        rangeInput.max = max;
        rangeInput.value = this.initial;
        containerElement.appendChild(rangeInput);
        
        // elements
        this._container = containerElement;
        this._container.classList.add('knob-input');
        this._input = rangeInput;
        this._input.classList.add('knob-input__input');
        this._visualElement = this._container.querySelector(`.${this.visualElementClass}`);
        this._visualElement.classList.add('knob-input__visual');
        
        // visual context
        this._visualContext = { element: this._visualElement };
        this.setupVisualContext.apply(this._visualContext);
        this.updateVisuals = this.updateVisuals.bind(this._visualContext);
        
        // internals
        this._activeDrag = false;
      
        // define event listeners
        // have to store bound versions of handlers so they can be removed later
        this._handlers = {
            inputChange: this.handleInputChange.bind(this),
            touchStart: this.handleTouchStart.bind(this),
            touchMove: this.handleTouchMove.bind(this),
            touchEnd: this.handleTouchEnd.bind(this),
            touchCancel: this.handleTouchCancel.bind(this),
            mouseDown: this.handleMouseDown.bind(this),
            mouseMove: this.handleMouseMove.bind(this),
            mouseUp: this.handleMouseUp.bind(this),
            mouseWheel: this.handleMouseWheel.bind(this),
            doubleClick: this.handleDoubleClick.bind(this),
            focus: this.handleFocus.bind(this),
            blur: this.handleBlur.bind(this),
        };
        // add listeners
        this._input.addEventListener('change', this._handlers.inputChange);
        this._input.addEventListener('touchstart', this._handlers.touchStart);
        this._input.addEventListener('mousedown', this._handlers.mouseDown);
        this._input.addEventListener('wheel', this._handlers.mouseWheel);
        this._input.addEventListener('dblclick', this._handlers.doubleClick);
        this._input.addEventListener('focus', this._handlers.focus);
        this._input.addEventListener('blur', this._handlers.blur);
        // init
        // this.updateToInputValue();
    }
    
    static setupRotationContext(minRotation, maxRotation) {
        return function() {
            this.minRotation = minRotation;
            this.maxRotation = maxRotation;
        };
    }
    
    static rotationUpdateFunction(norm) {
        this.element.style['transform'] = `rotate(${this.maxRotation*norm-this.minRotation*(norm-1)}deg)`;
    }
    
    // handlers
    handleInputChange(evt) {
        this.updateToInputValue();
    }
    
    handleTouchStart(evt) {
        this.clearDrag();

        evt.cancelable && evt.preventDefault();
        var touch = evt.changedTouches.item(evt.changedTouches.length - 1);
        this._activeDrag = touch.identifier;
        this.startDrag(touch.clientY);
        // drag update/end listeners
        document.body.addEventListener('touchmove', this._handlers.touchMove);
        document.body.addEventListener('touchend', this._handlers.touchEnd);
        document.body.addEventListener('touchcancel', this._handlers.touchCancel);
    }
    
    handleTouchMove(evt) {
        var activeTouch = this.findActiveTouch(evt.changedTouches);
        if (activeTouch) {
            this.updateDrag(activeTouch.clientY);
        } else if (!this.findActiveTouch(evt.touches)) {
            this.clearDrag();
        }
    }
    
    handleTouchEnd(evt) {
        var activeTouch = this.findActiveTouch(evt.changedTouches);
        if (activeTouch) {
            this.finalizeDrag(activeTouch.clientY);
        }
    }
    
    handleTouchCancel(evt) {
        if (this.findActiveTouch(evt.changedTouches)) {
            this.clearDrag();
        }
    }
    
    handleMouseDown(evt) {
        this.clearDrag();
        evt.preventDefault();
        this._activeDrag = true;
        this.startDrag(evt.clientY);
        // drag update/end listeners
        document.body.addEventListener('mousemove', this._handlers.mouseMove);
        document.body.addEventListener('mouseup', this._handlers.mouseUp);
    }
    
    handleMouseMove(evt) {
        if (evt.buttons&1) {
            this.updateDrag(evt.clientY);
        } else {
            this.finalizeDrag(evt.clientY);
        }
    }
    
    handleMouseUp(evt) {
        this.finalizeDrag(evt.clientY);
    }
    
    handleMouseWheel(evt) {
        this._input.focus();
        this.clearDrag();
        this._prevValue = parseFloat(this._input.value);
        this.updateFromDrag(evt.deltaY, this.wheelResistance);
    }
    
    handleDoubleClick(evt) {
        this.clearDrag();
        this._input.value = this.initial;
        this.updateToInputValue();
    }
    
    handleFocus(evt) {
        this._container.classList.add('focus-active');
    }
    
    handleBlur(evt) {
        this._container.classList.remove('focus-active');
    }
    
    // dragging
    startDrag(yPosition) {
        this._dragStartPosition = yPosition;
        this._prevValue = parseFloat(this._input.value);
        
        this._input.focus();
        document.body.classList.add('knob-input__drag-active');
        this._container.classList.add('drag-active');
    }
    
    updateDrag(yPosition) {
        var diff = yPosition - this._dragStartPosition;
        this.updateFromDrag(diff, this.dragResistance);
        this._input.dispatchEvent(new InputEvent('change'));
    }
    
    finalizeDrag(yPosition) {
        var diff = yPosition - this._dragStartPosition;
        this.updateFromDrag(diff, this.dragResistance);
        this.clearDrag();
        this._input.dispatchEvent(new InputEvent('change'));
    }
    
    clearDrag() {
        document.body.classList.remove('knob-input__drag-active');
        this._container.classList.remove('drag-active');
        this._activeDrag = false;
        this._input.dispatchEvent(new InputEvent('change'));
        // clean up event listeners
        document.body.removeEventListener('mousemove', this._handlers.mouseMove);
        document.body.removeEventListener('mouseup', this._handlers.mouseUp);
        document.body.removeEventListener('touchmove', this._handlers.touchMove);
        document.body.removeEventListener('touchend', this._handlers.touchEnd);
        document.body.removeEventListener('touchcancel', this._handlers.touchCancel);
    }
    
    updateToInputValue() {
        var normVal = this.normalizeValue(parseFloat(this._input.value));
        this.updateVisuals(normVal);
    }
    
    updateFromDrag(dragAmount, resistance) {
        var newVal = this.clampValue(this._prevValue - (dragAmount/resistance));
        this._input.value = newVal;
        this.updateVisuals(this.normalizeValue(newVal));
    }
    
    // utils
    clampValue(val) {
        var min = parseFloat(this._input.min);
        var max = parseFloat(this._input.max);
        return Math.min(Math.max(val, min), max);
    }
    
    normalizeValue(val) {
        var min = parseFloat(this._input.min);
        var max = parseFloat(this._input.max);
        return (val-min)/(max-min);
    }
  
    findActiveTouch(touchList) {
        var i, len, touch;
        for (i=0, len=touchList.length; i<len; i++)
            if (this._activeDrag === touchList.item(i).identifier)
                return touchList.item(i);
        return null;
    }
    
    // public passthrough methods
    addEventListener() { this._input.addEventListener.apply(this._input, arguments); }
    removeEventListener() { this._input.removeEventListener.apply(this._input, arguments); }
    focus() { this._input.focus.apply(this._input, arguments); }
    blur() { this._input.blur.apply(this._input, arguments); }
    
    // getters/setters
    get value() {
        return parseFloat(this._input.value);
    }
    set value(val) {
        this._input.value = val;
        this.updateToInputValue();
        this._input.dispatchEvent(new Event('change'));
    }
}

  
  
  