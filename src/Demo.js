import './Demo.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Parameters from './components/Parameters.js';
import Modal from 'react-modal';

var [modalIsOpen, setIsOpen] = [false, null];
var pipeline = { "name" : "None" };
var [args, setArgs] = [{}, null];

function displayParameters(event, item) {
  console.log(item);
  pipeline = item;

  var ta = {
    destination: pipeline.destinations[0].name
  }
  if (pipeline.arguments) {
    pipeline.arguments.forEach(arg => {
      ta[arg.name] = arg.defaultValue ?? '';
    });
  }
  setArgs(ta);

  setIsOpen(true);
}

function closeModal() {
  setIsOpen(false);
}

function submitModal(values) {
  console.log(values);
  setIsOpen(false);
}

function MenuItem(props) {
  return (
    <Link className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" onClick={e => displayParameters(e, props.item)}>
      {props.item.name}
    </Link>
  );
}

function MenuLevel(props) {
  var children = props.items;

  var ulClass=props.topLevel ? 'w-52 dropdown-content absolute hidden text-gray-700 pt-1' : 'ml-40 -mt-10 min-w-[208px] dropdown-content absolute hidden text-gray-700 pt-1';

  return (
    <ul className={ulClass}>
      {children.map((value, index) => {
        if (value.children) {
          return (
            <li className="dropdown" key={value.path}>
              <span className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" >{value.name}
                <svg className="inline w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <MenuLevel items={value.children}></MenuLevel>
            </li>
          );
        } else {
          return (
            <li key={value.path} className=""><MenuItem item={value}/></li>
          );
        }
      })}
    </ul>
  );
}

function Demo(props) {

  [modalIsOpen, setIsOpen] = useState(false);
  [args, setArgs] = useState({});

  Modal.setAppElement('#root');

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      padding: '0px',
      margin: '0px'
    },
  };

  return (
    <>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        <Parameters onRequestClose={closeModal} onRequestSubmit={submitModal} pipeline={pipeline} values={args} >
        </Parameters>
      </Modal>
      <nav id="header" className="w-full z-30 py-1 bg-white shadow-lg border-b border-blue-400">
        <div className="w-full flex items-center justify-between mt-0 px-6 py-2">
          <div className="container-fluid">
            <div className="inline-block relative">
              <button className="text-gray-700 font-semibold py-2 px-4 inline-flex items-center">
                <span>
                  <Link className="nav-link dropdown-toggle" to="/">Home</Link>
                </span>
              </button>
            </div>
            <div className="dropdown inline-block relative">
              <button className="text-gray-700 font-semibold py-2 px-4 inline-flex items-center">
                <span>
                  Edit
                  <svg className="inline w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <ul className="w-52 dropdown-content absolute hidden text-gray-700 pt-1">
                <li><span className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Custom Headers</span></li>
              </ul>
            </div>
            <div className="dropdown inline-block relative">
              <button className="text-gray-700 font-semibold py-2 px-4 inline-flex items-center">
                <span>
                  Data
                  <svg className="inline w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <MenuLevel items={props.available.children} topLevel={true}>
              </MenuLevel>
            </div>
            <div className="inline-block relative">
              <button className="text-gray-700 font-semibold py-2 px-4 inline-flex items-center">
                <span>
                  <Link className="nav-link dropdown-toggle" to="/">Other</Link>
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Demo;