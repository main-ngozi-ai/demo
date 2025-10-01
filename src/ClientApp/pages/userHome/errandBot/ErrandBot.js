import React, { useState, useEffect } from 'react';
import {
  Box, CardContent, Typography, Button,
  Select, MenuItem, FormControl, InputLabel, Alert, Tooltip,
  CircularProgress, TextField, IconButton, Grid, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import { 
  getSelectedAgent, 
  loadSavedAgent, 
  getAgentShopProducts, 
  deleteAgentShop,
  saveShopAndProduct,
  deleteUserProduct
} from '../../../../core/api/auth';

// A simple validator to prevent use of < or >
const isValidInput = (input) => {
  return !/[<>]/.test(input);
};

// Formats a number as U.S. currency (without the $ symbol)
const formatCurrency = (value) => {
  const numeric = parseFloat(value);
  if (isNaN(numeric)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
};

const getSelectedAgentDetails = async (id) => {
  try {
    const resp = await getSelectedAgent(id);
    return resp ? resp.properties : null;
  } catch (err) {
    console.error('Error fetching Agent details:', err);
    return null;
  }
};

const ErrandBot = ({user}) => {
  const userId = user?.id;
  const [savedAgents, setSavedAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [agentProps, setAgentProps] = useState(null);
  const [loadingAgent, setLoadingAgent] = useState(false);

  const [shops, setShops] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [newShopName, setNewShopName] = useState('');
  const [isAddingNewShop, setIsAddingNewShop] = useState(false);
  const [createTaskMode, setCreateTaskMode] = useState(false);
  const [products, setProducts] = useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ========== Styling ==========
  const mainContainerSx = { p: 2, backgroundColor: '#161d27', color: '#ccc', minHeight: '100vh' };
  const cardSx = { backgroundColor: '#161d27', border: '1px solid #444', color: '#ccc', mb: 2, p: 2 };
  const formControlSx = { 
    mb: 2, 
    mr: 2, 
    minWidth: { xs: '100%', sm: 200 },
    '& .MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444', borderWidth: '1px' },
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }
    },
    '& .MuiFormLabel-root': { color: '#ccc' }
  };
  const textFieldSx = {
    mb: 2, 
    mr: 2, 
    minWidth: { xs: '100%', sm: 200 },
    '& .MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444', borderWidth: '1px' },
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }
    },
    '& .MuiInputLabel-root': { color: '#ccc' },
    input: { color: '#ccc' },
  };

  // ========== On mount, load agent & shop data ==========
  useEffect(() => {
    const fetchSavedAgents = async () => {
      try {
        const agents = await loadSavedAgent(userId);
        const agentsArray = Array.isArray(agents) ? agents : (agents ? [agents] : []);
        setSavedAgents(agentsArray);
        if (agentsArray.length > 0) {
          const defaultAgent = agentsArray[0];
          setSelectedAgentId(defaultAgent.id);
          handleAgentChange(defaultAgent.id);
        }
      } catch (error) {
        console.error("Error loading saved agents:", error);
      }
    };
    fetchSavedAgents();
    fetchShopsAndProducts(selectedAgentId)
  }, []);

  const fetchShopsAndProducts = async (id) => {
      try {
        const shopsResponse = await getAgentShopProducts(id);
        setShops(shopsResponse.shops || []);
        setAllProducts(shopsResponse.products || []);
      } catch (error) {
        console.error("Error loading shops/products:", error);
      }
    };

  const handleAgentChange = async (id) => {
    setSelectedAgentId(id);
    if (!id) {
      setAgentProps(null);
      return;
    }
    setLoadingAgent(true);
    const details = await getSelectedAgentDetails(id);
    setAgentProps(details);
    fetchShopsAndProducts(selectedAgentId)
    setLoadingAgent(false);
  };

  const handleShopChange = (id) => {
    setSelectedShopId(id);
    setIsAddingNewShop(false);
    if (!id) {
      setProducts([]);
      return;
    }
    const matchedProducts = allProducts.filter(p => p.shop_id === id);
    if (matchedProducts.length > 0) {
      setProducts(matchedProducts);
      setCreateTaskMode(true);
    } else {
      setCreateTaskMode(false);
      setProducts([]);
    }
  };

  const handleDeleteShopClick = () => {
    if (!selectedShopId) return;
    setOpenDeleteDialog(true);
  };

  const handleConfirmDeleteShop = async () => {
    await deleteAgentShop(selectedShopId);
    setShops(shops.filter(shop => shop.id !== selectedShopId));
    setAllProducts(allProducts.filter(p => p.shop_id !== selectedShopId));
    setSelectedShopId(null);
    setProducts([]);
    setOpenDeleteDialog(false);
  };

  const handleCancelDeleteShop = () => {
    setOpenDeleteDialog(false);
  };

  const handleCreateTask = () => {
    setCreateTaskMode(true);
    if (isAddingNewShop) {
      setProducts([{ name: "", description: "", price: "", link: "" }]);
    } else {
      const matchedProducts = allProducts.filter(p => p.shop_id === selectedShopId);
      if (matchedProducts.length > 0) {
        setProducts(matchedProducts);
      } else {
        setProducts([{ name: "", description: "", price: "", link: "" }]);
      }
    }
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handlePriceChange = (index, value) => {
    handleProductChange(index, 'price', value);
  };
  
  const handlePriceBlur = (index, value) => {
    const cleaned = value.replace(/[$,]/g, '');
    const numberVal = parseFloat(cleaned);
    if (!isNaN(numberVal)) {
      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numberVal);
      handleProductChange(index, 'price', formatted);
    }
  };

  const handleAddRow = () => {
    setProducts([...products, { name: "", description: "", price: "", link: "" }]);
  };

  const handleRemoveRow = (index) => {
    if (index === 0) return;
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleSaveTask = async () => {
    if (!selectedAgentId) {
      setErrorMsg("Please select an agent.");
      return;
    }
    if (isAddingNewShop && newShopName.trim() === '') {
      setErrorMsg("Shop name is required when adding a new shop.");
      setSuccessMsg('');
      return;
    }
    // Validate each product
    for (let product of products) {
      if (!product.name || !product.description || !product.price || !product.link) {
        setErrorMsg("All product fields are required.");
        setSuccessMsg('');
        return;
      }
      if (!isValidInput(product.name) || !isValidInput(product.description) || !isValidInput(product.link)) {
        setErrorMsg("Invalid characters in product fields.");
        setSuccessMsg('');
        return;
      }
      if (isNaN(parseFloat(product.price.replace(/,/g, '')))) {
        setErrorMsg("Price must be a valid number.");
        setSuccessMsg('');
        return;
      }
    }
    
    const productsToSave = products.map(product => ({
      ...product,
      agent_id: selectedAgentId,
      user_id: userId
    }));
    
    await saveShopAndProduct({ 
      shop: isAddingNewShop ? null : selectedShopId, 
      shopName: isAddingNewShop ? newShopName : "",
      agent_id: selectedAgentId, 
      user_id: userId, 
      products: productsToSave 
    });
    
    setSuccessMsg("Errand saved successfully.");
    setErrorMsg('');
    setNewShopName('');
    setSelectedShopId(null);
    setIsAddingNewShop(false);
    setCreateTaskMode(false);
    setProducts([]);
  };

  const handleCancelTask = () => {
    setCreateTaskMode(false);
    setProducts([]);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <Box sx={mainContainerSx}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#ccc' }}>
              Agent shop:
            </Typography>
          </Grid>
        </Grid>
      <Dialog open={openDeleteDialog} onClose={handleCancelDeleteShop}>
        <DialogTitle>Delete Shop</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Warning: Deleting this shop will delete all products in that shop. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDeleteShop} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDeleteShop} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Box sx={cardSx}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#ccc' }}>Select Agent:</Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
            <FormControl sx={formControlSx}>
              <InputLabel sx={{ color: '#ccc' }}>Agent</InputLabel>
              <Select
                sx={{ color: '#ccc' }}
                value={selectedAgentId || ''}
                onChange={(e) => handleAgentChange(Number(e.target.value))}
                label="Agent"
              >
                {savedAgents.map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.model_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {agentProps && agentProps.chat_gpt_id && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Agent ID: {agentProps.chat_gpt_id}
                </Typography>
                <IconButton
                  onClick={() => navigator.clipboard.writeText(agentProps.chat_gpt_id)}
                  sx={{ ml: 1 }}
                >
                  <FileCopyIcon sx={{ color: '#ccc' }} />
                </IconButton>
              </Box>
            )}
          </Box>
          <Box sx={{ flex: 1, p: 2, border: '1px solid #444', borderRadius: 1, mt: 2 }}>
            {loadingAgent ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: '#ccc' }} />
                <Typography sx={{ color: '#ccc' }}>Loading agent details...</Typography>
              </Box>
            ) : agentProps ? (
              <>
                <Typography variant="subtitle2" sx={{ color: '#ccc' }}>
                  Trait: <span style={{ color: '#fff' }}>{agentProps.trait}</span>
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#ccc' }}>
                  Description: <span style={{ color: '#fff' }}>{agentProps.description}</span>
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#ccc' }}>
                  Behavioral: <span style={{ color: '#fff' }}>{agentProps.behavioral_manifestation}</span>
                </Typography>
              </>
            ) : (
              <Typography variant="body2" sx={{ color: '#999' }}>No agent selected</Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center', mt: 2 }}>
            {!isAddingNewShop ? (
              shops.length > 0 && (
                <>
                  <FormControl sx={formControlSx}>
                    <InputLabel sx={{ color: '#ccc' }}>Shop</InputLabel>
                    <Select
                      sx={{ color: '#ccc' }}
                      value={selectedShopId || ''}
                      onChange={(e) => handleShopChange(Number(e.target.value))}
                      label="Shop"
                    >
                      {shops.map(shop => (
                        <MenuItem key={shop.id} value={shop.id}>
                          {shop.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton onClick={handleDeleteShopClick} disabled={!selectedShopId}>
                    <DeleteForeverIcon sx={{ color: '#ff4444' }} />
                  </IconButton>
                </>
              )
            ) : (
              <TextField
                label="Shop Name"
                value={newShopName}
                onChange={(e) => setNewShopName(e.target.value)}
                sx={textFieldSx}
              />
            )}
            
            {!shops.length > 0 && (<Button
              variant="outlined"
              disabled={isAddingNewShop}
              sx={{
                backgroundColor: '#161d27',
                borderColor: '#444',
                color: '#fff',
                textTransform: 'none'
              }}
              onClick={() => {
                setIsAddingNewShop(true);
                setSelectedShopId(null);
                setProducts([]);
                setCreateTaskMode(false);
              }}
            >
              Add New Shop
            </Button>
            )}
            {isAddingNewShop && (
              <Button
                variant="outlined"
                onClick={() => {
                  setIsAddingNewShop(false);
                  setNewShopName('');
                }}
                sx={{
                  backgroundColor: '#161d27',
                  borderColor: '#444',
                  color: '#fff',
                  textTransform: 'none'
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </CardContent>
      </Box>

      <Box sx={cardSx}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#ccc' }}>Product Lists:</Typography>
          {errorMsg && (
            <Alert severity="error" onClose={() => setErrorMsg('')} sx={{ mb: 2, backgroundColor: '#261d1d', color: 'red' }}>
              {errorMsg}
            </Alert>
          )}
          {successMsg && (
            <Alert severity="success" onClose={() => setSuccessMsg('')} sx={{ mb: 2, backgroundColor: '#1d2620', color: 'green' }}>
              {successMsg}
            </Alert>
          )}
          {!createTaskMode ? (
            <Button
              variant="outlined"
              onClick={handleCreateTask}
              sx={{
                backgroundColor: '#161d27',
                borderColor: '#444',
                color: '#fff',
                textTransform: 'none'
              }}
            >
              Create products for Bot
            </Button>
          ) : (
            <>
              {products.map((product, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 2 }}
                >
                  <TextField
                    label="Product Name"
                    value={product.name || ""}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                    sx={textFieldSx}
                    error={!product.name}
                    helperText={!product.name ? "Required" : ""}
                  />
                  <TextField
                    label="Description"
                    value={product.description || ""}
                    onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                    sx={textFieldSx}
                    error={!product.description}
                    helperText={!product.description ? "Required" : ""}
                  />
                  <TextField
                    label="Price"
                    type="text"
                    value={product.price || ""}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                    onBlur={(e) => handlePriceBlur(index, e.target.value)}
                    sx={textFieldSx}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }}
                  />
                  <TextField
                    label="Link"
                    value={product.link || ""}
                    onChange={(e) => handleProductChange(index, 'link', e.target.value)}
                    sx={textFieldSx}
                  />
                  <IconButton
                    onClick={() => handleRemoveRow(index)}
                    disabled={index === 0}
                  >
                    <RemoveCircleOutlineIcon sx={{ color: index === 0 ? '#999' : '#66ccff' }} />
                  </IconButton>
                  <IconButton onClick={handleAddRow}>
                    <AddCircleOutlineIcon sx={{ color: '#66ccff' }} />
                  </IconButton>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  sx={{ textTransform: 'none', borderColor: '#444', color: '#ccc' }}
                  startIcon={<CancelIcon sx={{ color: '#ccc' }} />}
                  onClick={handleCancelTask}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  sx={{ textTransform: 'none', borderColor: '#444', color: '#ccc' }}
                  startIcon={<CheckCircleIcon sx={{ color: '#ccc' }} />}
                  onClick={handleSaveTask}
                >
                  Save
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Box>
    </Box>
  );
};

export default ErrandBot;
