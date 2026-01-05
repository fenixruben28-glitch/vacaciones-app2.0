export const employeeData = [
  // --- GERENCIA GENERAL ---
  {
    id: 'ADMIN001',
    name: 'Gerente General',
    position: 'Gerente General',
    branch: 'Gerencia Estatal',
    department: 'Administración',
    role: 'admin',
    branchType: 'gerencia'
  },
  
  // --- GERENCIA ESTATAL STAFF ---
  {
    id: 'GE001',
    name: 'Coordinador de Operaciones',
    position: 'Coordinador',
    branch: 'Gerencia Estatal',
    department: 'Operaciones',
    coordinator: 'Gerente General',
    role: 'employee',
    branchType: 'gerencia'
  },
  {
    id: 'GE002',
    name: 'Coordinador de Finanzas',
    position: 'Coordinador',
    branch: 'Gerencia Estatal',
    department: 'Finanzas',
    coordinator: 'Gerente General',
    role: 'employee',
    branchType: 'gerencia'
  },
  {
    id: 'GE003',
    name: 'Coordinador de RRHH',
    position: 'Coordinador',
    branch: 'Gerencia Estatal',
    department: 'Recursos Humanos',
    coordinator: 'Gerente General',
    role: 'employee',
    branchType: 'gerencia'
  },
  {
    id: 'GE004',
    name: 'Analista de Operaciones',
    position: 'Analista',
    branch: 'Gerencia Estatal',
    department: 'Operaciones',
    coordinator: 'Coordinador de Operaciones',
    role: 'employee',
    branchType: 'gerencia'
  },

  // --- PERSONAL VOLANTE ---
  {
    id: 'VOL001',
    name: 'Cajero Volante 1',
    position: 'Cajero Volante',
    branch: 'Volante',
    department: 'Operaciones',
    role: 'employee',
    branchType: 'volante'
  },
  {
    id: 'VOL002',
    name: 'Cajero Volante 2',
    position: 'Cajero Volante',
    branch: 'Volante',
    department: 'Operaciones',
    role: 'employee',
    branchType: 'volante'
  }
];

// Helper to generate branch employees
const generateBranchEmployees = () => {
  const branches = [];
  
  // Define branch types for 1001-1023
  // 1001-1010: Rural
  // 1011-1020: Urban
  // 1021-1023: Multipersonal
  
  for (let i = 1; i <= 23; i++) {
    const branchNum = 1000 + i;
    const branchName = `Sucursal ${branchNum}`;
    let type = 'rural';
    let staffCount = 2; // Admin + Cajero

    if (i >= 11 && i <= 20) {
      type = 'urban';
      staffCount = 3; // Admin + 2 Cajeros
    } else if (i >= 21) {
      type = 'multipersonal';
      staffCount = 5; // Admin + 3 Cajeros + Asesor
    }

    // Administrator
    branches.push({
      id: `${branchNum}-01`,
      name: `Administrador ${branchName}`,
      position: 'Administrador',
      branch: branchName,
      department: 'Administración',
      role: 'employee',
      branchType: type
    });

    // Staff
    for (let j = 2; j <= staffCount; j++) {
      let position = 'Cajero';
      let dept = 'Operaciones';
      
      if (type === 'multipersonal' && j === staffCount) {
        position = 'Asesor';
        dept = 'Ventas';
      }

      branches.push({
        id: `${branchNum}-0${j}`,
        name: `${position} ${j-1} ${branchName}`,
        position: position,
        branch: branchName,
        department: dept,
        role: 'employee',
        branchType: type
      });
    }
  }
  return branches;
};

// Add generated branches to the main array
employeeData.push(...generateBranchEmployees());