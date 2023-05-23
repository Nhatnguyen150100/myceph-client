import React from 'react';

export default function ButtonComponent(props) {
	return (
		<button
			onClick={props.onClick}
			className={`border-0 rounded-pill text-uppercase fw-bold ${props.className?props.className:"btn btn-primary"} ${props.btnType?props.btnType:"btn-info"}`}
			style={{ color: 'white', width: '100%', height: '50px' }}
			disabled={props.disabled}
			>
			{props.label}
		</button>
	);
}
