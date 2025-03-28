import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { fetchMarketingCampaigns, addMarketingCampaign } from "@/utils/api";
import { errorToast, successToast } from "@/utils/ToastNotfications";

function MarketingCampaigns() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [campaignType, setCampaignType] = useState("physical");
  const [campaignData, setCampaignData] = useState({
    type: "physical",
    city: "",
    area: "",
    ROAS: "",
    startDate: "",
    endDate: "",
    managedBy: user.id,
  });

  const { data: physicalCampaigns = [], isLoading: isLoadingPhysical } =
    useQuery({
      queryKey: ["marketingCampaigns", "physical"],
      queryFn: () => fetchMarketingCampaigns("physical"),
    });

  const { data: digitalCampaigns = [], isLoading: isLoadingDigital } = useQuery(
    {
      queryKey: ["marketingCampaigns", "digital"],
      queryFn: () => fetchMarketingCampaigns("digital"),
    }
  );

  const mutation = useMutation({
    mutationFn: addMarketingCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries(["marketingCampaigns"]);
      successToast("Campaign added successfully !");
      setCampaignData({
        type: campaignType,
        city: "",
        area: "",
        ROAS: "",
        startDate: "",
        endDate: "",
        managedBy: user.id,
      });
      setShowForm(false);
    },
    onError: (error) => {
      errorToast(`Error adding campaign: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(campaignData);
  };

  const handleChange = (e) => {
    setCampaignData({ ...campaignData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const cancelForm = () => {
    setShowForm(false);
    setCampaignData({
      type: campaignType,
      city: "",
      area: "",
      ROAS: "",
      startDate: "",
      endDate: "",
      managedBy: user.id,
    });
  };

  const renderCampaignTable = (campaigns, type) => {
    console.log(campaigns);
    return campaigns.length === 0 ? (
      <EmptyState>
        <p>No {type} marketing campaigns found</p>
      </EmptyState>
    ) : (
      <Table>
        <thead>
          <tr>
            <Th>City</Th>
            <Th>Area</Th>
            <Th>ROAS</Th>
            <Th>Start Date</Th>
            <Th>End Date</Th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign._id}>
              <Td>{campaign.city}</Td>
              <Td>{campaign.area}</Td>
              <Td>{campaign.ROAS}</Td>
              <Td>{new Date(campaign.startDate).toLocaleDateString()}</Td>
              <Td>{new Date(campaign.endDate).toLocaleDateString()}</Td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <Title>Marketing Campaigns Management</Title>
      {!showForm ? (
        <AddButton onClick={toggleForm}>+ Add New Campaign</AddButton>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Select
            name="type"
            value={campaignData.type}
            onChange={(e) => {
              setCampaignType(e.target.value);
              setCampaignData({ ...campaignData, type: e.target.value });
            }}
          >
            <option value="physical">Physical Campaign</option>
            <option value="digital">Digital Campaign</option>
          </Select>
          <Input
            type="text"
            name="city"
            placeholder="City"
            value={campaignData.city}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="area"
            placeholder="Area"
            value={campaignData.area}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="ROAS"
            placeholder="ROAS"
            value={campaignData.ROAS}
            onChange={handleChange}
            step="0.1"
            required
          />
          <Input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={campaignData.startDate}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={campaignData.endDate}
            onChange={handleChange}
            required
          />
          <ButtonGroup>
            <FormButton type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? (
                <>
                  <LoadingSpinner /> Adding...
                </>
              ) : (
                "Add Campaign"
              )}
            </FormButton>
            <CancelButton type="button" onClick={cancelForm}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </Form>
      )}

      <Title>Physical Marketing Campaigns</Title>
      {isLoadingPhysical ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>loading physical campaigns...</p>
        </LoadingContainer>
      ) : (
        renderCampaignTable(physicalCampaigns, "physical")
      )}

      <Title>Digital Marketing Campaigns</Title>
      {isLoadingDigital ? (
        <LoadingContainer>
          <LoadingSpinner /> <p>loading digital campaigns</p>
        </LoadingContainer>
      ) : (
        renderCampaignTable(digitalCampaigns, "digital")
      )}
    </Container>
  );
}

export default MarketingCampaigns;

// Styled Components (similar to Vendor page)
const Container = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 800px;
  margin: 1.5rem auto;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Input = styled.input`
  flex: 1 1 45%;
  padding: 0.8rem;
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: 5px;
  font-size: 1rem;
  min-width: 200px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 3px ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  flex: 1 1 45%;
  padding: 0.8rem;
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: 5px;
  font-size: 1rem;
  min-width: 200px;
`;

const Button = styled.button`
  padding: 0.8rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.muted};
    cursor: not-allowed;
  }
`;

const AddButton = styled(Button)`
  margin: 0 auto 2rem;
  width: auto;
  padding: 0.8rem 1.5rem;
`;

const FormButton = styled(Button)`
  width: 100%;
  max-width: 200px;
`;

const CancelButton = styled.button`
  padding: 0.8rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  max-width: 200px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray || "#f5f5f5"};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  width: 100%;
  justify-content: center;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 2rem;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.colors.muted};
  padding: 12px;
`;

const TableRow = styled.tr`
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray || "#f5f5f5"};
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
`;

const CampaignCard = styled.div`
  background: ${({ theme }) => theme.colors.lightGray || "#f5f5f5"};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
