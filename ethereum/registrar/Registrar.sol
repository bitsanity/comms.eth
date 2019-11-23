pragma solidity ^0.5.0;

// Forward declarations for external dependencies

interface ENS {
  function owner( bytes32 _node ) external view returns (address);
  function setSubnodeOwner( bytes32 _node, bytes32 _label, address _owner )
    external;
}

interface Resolver {
  function setAddr( bytes32 _node, address _newAddr ) external;
  function setPubkey( bytes32 _node, bytes32 _x, bytes32 _y ) external;
}

interface ERC20 {
  function balanceOf( address owner ) external view returns (uint);
  function transfer( address _to, uint256 _value ) external returns (bool);
}

// A basic first-come-first-served (FCFS) registrar.
contract Registrar {

  event LabelRegistered( string label, address indexed owner );
  event TopicRegistered( string topic, address indexed owner );

  ENS public theENS;
  Resolver public myResolver;
  bytes32 public myRootNode;
  address payable public beneficiary;

  function toNode( string memory _label ) internal view returns (bytes32) {
    bytes32 labelhash = keccak256( abi.encodePacked(_label) );
    return keccak256( abi.encodePacked(myRootNode, labelhash) );
  }

  modifier canChange( string memory _label ) {
    address currentOwner = theENS.owner( toNode(_label) );
    require(    currentOwner == address(0x0)
             || currentOwner == msg.sender );
    _;
  }

  function baseReg( string memory _label ) internal canChange(_label)
  returns (bytes32) {
    require( msg.value > 0 );
    bytes32 labelhash = keccak256( abi.encodePacked(_label) );
    theENS.setSubnodeOwner( myRootNode, labelhash, address(this) );
    return labelhash;
  }

  function registerLabel( string calldata _label, address _owner ) payable
  external {
    bytes32 labelhash = baseReg( _label );
    myResolver.setAddr( toNode(_label), _owner );
    theENS.setSubnodeOwner( myRootNode, labelhash, _owner );
    emit LabelRegistered( _label, _owner );
  }

  function registerLabelAndKey( string calldata _label,
                                bytes32 _x,
                                bytes32 _y,
                                address _owner ) payable external {
    bytes32 labelhash = baseReg( _label );
    myResolver.setPubkey( toNode(_label), _x, _y );
    theENS.setSubnodeOwner( myRootNode, labelhash, _owner );
    emit LabelRegistered( _label, _owner );
  }

  function registerTopic( string calldata _topic, address _owner )
  payable external {
    bytes32 labelhash = baseReg( _topic );
    theENS.setSubnodeOwner( myRootNode, labelhash, _owner );
    emit TopicRegistered( _topic, _owner );
  }

  constructor ( address _ens,
                address _resolver,
                bytes32 _node ) public {
    theENS = ENS( _ens );
    myResolver = Resolver( _resolver );
    myRootNode = _node;
    beneficiary = msg.sender;
  }

  // any donations of eth and erc20-compatible tokens gratefully accepted
  function () payable external {}

  function sweepEther() external {
    beneficiary.transfer( address(this).balance );
  }

  function sweepToken( address _erc20 ) external {
    ERC20 token = ERC20( _erc20 );
    token.transfer( beneficiary, token.balanceOf(beneficiary) );
  }

  function changeBeneficiary( address payable _to ) external {
    require( msg.sender == beneficiary );
    beneficiary = _to;
  }

}

