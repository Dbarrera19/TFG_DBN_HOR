import React, { useState, useEffect } from 'react';
import AdminTable from '../components/AdminTable';
import ClientForm from '../components/ClientForm';
import { categoriasService, productosService, clientesService, pedidosService, detallepedidosService } from '../services/api';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingStates';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('categorias');
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [activeTab]);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      setError('');

      if (activeTab === 'categorias') {
        const data = await categoriasService.getAll();
        setCategorias(Array.isArray(data) ? data : []);
      } else if (activeTab === 'productos') {
        const data = await productosService.getAll();
        setProductos(Array.isArray(data) ? data : []);
      } else if (activeTab === 'clientes') {
        const data = await clientesService.getAll();
        setClientes(Array.isArray(data) ? data : []);
      } else if (activeTab === 'pedidos') {
        const data = await pedidosService.getAll();
        setPedidos(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (activeTab === 'categorias') {
        await categoriasService.delete(id);
        setCategorias(categorias.filter(c => c.id !== id));
      } else if (activeTab === 'productos') {
        await productosService.delete(id);
        setProductos(productos.filter(p => p.id !== id));
      } else if (activeTab === 'clientes') {
        await clientesService.delete(id);
        setClientes(clientes.filter(c => c.id !== id));
      } else if (activeTab === 'pedidos') {
        await pedidosService.delete(id);
        setPedidos(pedidos.filter(p => p.id !== id));
      }
      alert('✅ Eliminado correctamente');
    } catch (err) {
      alert('❌ Error: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="page-section">
      <div className="section-title">
        <h1>Panel de Administración</h1>
        <p>Gestiona todos los datos de tu tienda</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'categorias' ? 'active' : ''}`}
          onClick={() => setActiveTab('categorias')}
        >
          📁 Categorías
        </button>
        <button
          className={`admin-tab ${activeTab === 'productos' ? 'active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          📦 Productos
        </button>
        <button
          className={`admin-tab ${activeTab === 'clientes' ? 'active' : ''}`}
          onClick={() => setActiveTab('clientes')}
        >
          👥 Clientes
        </button>
        <button
          className={`admin-tab ${activeTab === 'pedidos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pedidos')}
        >
          🛒 Pedidos
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner message={`Cargando ${activeTab}...`} />
      ) : (
        <>
          {activeTab === 'categorias' && (
            <AdminCategoriesSection
              categorias={categorias}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
              showForm={showForm}
              editingItem={editingItem}
              onCancelForm={handleCancelForm}
              onRefresh={cargarDatos}
              setCategorias={setCategorias}
              setShowForm={setShowForm}
            />
          )}

          {activeTab === 'productos' && (
            <AdminProductsSection
              productos={productos}
              categorias={categorias}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
              showForm={showForm}
              editingItem={editingItem}
              onCancelForm={handleCancelForm}
              onRefresh={cargarDatos}
              setProductos={setProductos}
              setShowForm={setShowForm}
              setCategorias={setCategorias}
            />
          )}

          {activeTab === 'clientes' && (
            <AdminClientsSection
              clientes={clientes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
              showForm={showForm}
              editingItem={editingItem}
              onCancelForm={handleCancelForm}
              onRefresh={cargarDatos}
              setClientes={setClientes}
              setShowForm={setShowForm}
            />
          )}

          {activeTab === 'pedidos' && (
            <AdminOrdersSection
              pedidos={pedidos}
              onRefresh={cargarDatos}
            />
          )}
        </>
      )}
    </div>
  );
}

// ============ SECCIONES ESPECÍFICAS ============

function AdminCategoriesSection({ categorias, onDelete, onAdd, showForm, editingItem, onCancelForm, onRefresh, setCategorias, setShowForm }) {
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({ nombre: '', descripcion: '' });
    }
  }, [editingItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingItem) {
        await categoriasService.update(editingItem.id, formData);
      } else {
        const newCat = await categoriasService.create(formData);
        setCategorias([...categorias, newCat]);
      }
      alert('✅ Guardado correctamente');
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert('❌ Error: ' + (err.message || 'Error desconocido'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AdminTable
        title="Categorías"
        data={categorias}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'descripcion', label: 'Descripción' },
        ]}
        onEdit={onAdd} // Usa onAdd para consistencia
        onDelete={onDelete}
        onAdd={onAdd}
      />

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '600px', margin: '2rem auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>{editingItem ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows="3"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={isSaving}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={onCancelForm}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#ccc', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function AdminProductsSection({ productos, onDelete, onRefresh }) {
  return (
    <AdminTable
      title="Productos"
      data={productos}
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'precio', label: 'Precio', type: 'price' },
        { key: 'stock', label: 'Stock' },
        { key: 'marca', label: 'Marca' },
        { key: 'categoriaNombre', label: 'Categoría' },
      ]}
      onEdit={() => {}}
      onDelete={onDelete}
      onAdd={() => alert('Formulario de productos en desarrollo')}
    />
  );
}

function AdminClientsSection({ clientes, onDelete, onAdd, showForm, editingItem, onCancelForm, onRefresh, setClientes, setShowForm }) {
  const handleClientSubmit = async (clientData) => {
    try {
      if (editingItem) {
        await clientesService.update(editingItem.id, clientData);
      } else {
        const newClient = await clientesService.create(clientData);
        setClientes([...clientes, newClient]);
      }
      alert('✅ Guardado correctamente');
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert('❌ Error: ' + (err.message || 'Error desconocido'));
    }
  };

  return (
    <>
      <AdminTable
        title="Clientes"
        data={clientes}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'apellido', label: 'Apellido' },
          { key: 'email', label: 'Email' },
          { key: 'telefono', label: 'Teléfono' },
        ]}
        onEdit={onAdd}
        onDelete={onDelete}
        onAdd={onAdd}
      />

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '600px', margin: '2rem auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>{editingItem ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
          <ClientForm
            initialData={editingItem || {}}
            onSubmit={handleClientSubmit}
          />
          <button
            onClick={onCancelForm}
            style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', backgroundColor: '#ccc', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Cancelar
          </button>
        </div>
      )}
    </>
  );
}

function AdminOrdersSection({ pedidos, onRefresh }) {
  return (
    <AdminTable
      title="Pedidos"
      data={pedidos}
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'fecha', label: 'Fecha', render: (val) => new Date(val).toLocaleDateString('es-ES') },
        { key: 'nombreCliente', label: 'Cliente' },
        { key: 'total', label: 'Total', type: 'price' },
      ]}
      onEdit={() => {}}
      onDelete={() => {}}
      onAdd={() => alert('Los pedidos se crean desde el checkout')}
    />
  );
}
