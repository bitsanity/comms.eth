pragma solidity >=0.5.0;

contract ENSMock {

  event NewOwner( bytes32 indexed node, bytes32 indexed label, address owner );
  event NewResolver( bytes32 indexed node, address resolver );
  event Subnode( bytes32 indexed subnode );

  mapping(bytes32=>address) public owners;
  address public revreg;

  function owner(bytes32 _node) external view returns (address) {
    if (_node ==
    bytes32(0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2))
    {
      return revreg;
    }

    return owners[_node];
  }

  function setSubnodeOwner(bytes32 _node, bytes32 _label, address _owner)
  external {
    bytes32 subnode = keccak256( abi.encodePacked(_node, _label) );
    emit Subnode( subnode );
    owners[subnode] = _owner;
    emit NewOwner( _node, _label, _owner );
  }

  function resolver(bytes32 _node) external view returns (address) {
    // stop compiler warnings
    require( revreg != address(0x0) && _node != bytes32(0x0) );

    // matches test setup for the registrar
    return address(0x9E8bFcBC56a63ca595C262e1921D3B7a00BB9cF0);
  }

  function setResolver(bytes32 _node, address _addr ) external {
    emit NewResolver( _node, _addr );
  }

  constructor( address _revreg ) public {
    revreg = _revreg;
  }
}

