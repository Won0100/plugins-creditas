import { styled, Box } from "@mui/material";

export const OldContactsWrapper = styled(Box)(
  () => `
width: 100%;
overflow-y: hidden;

.list-wrapper {
  height: 100%;
  overflow-y: auto;
  padding: 0 15rem;

  .list-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;    
    padding: 10px;
    border-radius: 10px;

    button {
      border-radius: 5px;
      padding: 5px;
      background: #278cf7;
      border: none;
      font-weight: 400;
      font-size: 15px;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        filter: brightness(0.9);
      }
    }
  }

  .list-card-empty {
    text-align: center;

    a {
      color: inherit;
    }
  }
}

.message-wrapper {
  height: 100%;
  .message-header {
    height: 10%;
    display: flex;
    align-items: center;
    padding: 10px;

    .message-header-actions {
      button {
        background: none;
        border: none;
        cursor: pointer;
      }
    }

    .message-header-information {
      max-width: 80%;

      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        b {
          font-weight: 600;
        }
      }
    }
  }

  .message-list-container {
    height: 90%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    position: relative;
    padding: 10px;

    .message-card {
      padding: 8px;
      overflow-wrap: break-word;
      margin-top: 20px;
      border-radius: 8px;
      min-width: 100px;

      .message-card-header {
        display: flex;
        justify-content: space-between;

        .message-card-author {
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .message-card-body {
        a {
          color: inherit;
        }
      }
    }

   
  }
}
`
);

type ContainerProps = {
  isLeftMessage: boolean;
};

export const MessageContainer = styled("div")<ContainerProps>(
  ({ theme, isLeftMessage }) => {
    return {
      display: "flex",
      flexDirection: "column",
      width: isLeftMessage ? "50%" : "100%",
      alignItems: isLeftMessage ? "flex-start" : "flex-end",
      padding: "0 15rem",

      ".bold": {
        fontWeight: "bold",
      },

      ".displayName": {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "8px",
        columnGap: "2rem",
      },

      ".message": {
        position: "relative",
        marginBottom: "10px",
        padding: "15px",
        font: "400 .9em 'Open Sans', sans-serif",
        border: "none",
        borderRadius: "10px",
        minWidth: "15rem",
      },

      ".customerMessage": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgb(18, 28, 45)"
            : "rgb(244, 244, 246)",
        textAlign: "left",
        marginLeft: "20px",
      },

      ".agentMessage": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgb(204, 228, 255)"
            : "rgb(3, 11, 93)",
        color: theme.palette.mode === "dark" ? "#000" : "#fff",
        textAlign: "left",
        marginRight: "20px",
      },
    };
  }
);
